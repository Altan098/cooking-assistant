"""Тесты работают с настоящим PostgreSQL, но в отдельной схеме: рабочие данные не затрагиваются."""

import os
import tempfile
from collections.abc import Callable, Iterator

# Файлы тестов не должны попадать в рабочую папку. Задаётся до импорта настроек.
os.environ["UPLOAD_DIR"] = tempfile.mkdtemp(prefix="cooking-assistant-tests-")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

import app.models  # noqa: F401
from app.core.config import settings
from app.core.database import Base, get_db
from app.core.rate_limit import login_limiter
from app.main import app as fastapi_app

TEST_SCHEMA = "test_cooking_assistant"

test_engine = create_engine(settings.database_url, connect_args={"options": f"-csearch_path={TEST_SCHEMA}"})
TestSession = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)


def override_get_db() -> Iterator[Session]:
    with TestSession() as db:
        yield db


@pytest.fixture(scope="session", autouse=True)
def test_schema() -> Iterator[None]:
    with test_engine.begin() as connection:
        connection.execute(text(f'DROP SCHEMA IF EXISTS "{TEST_SCHEMA}" CASCADE'))
        connection.execute(text(f'CREATE SCHEMA "{TEST_SCHEMA}"'))
    Base.metadata.create_all(test_engine)
    fastapi_app.dependency_overrides[get_db] = override_get_db
    yield
    fastapi_app.dependency_overrides.clear()
    with test_engine.begin() as connection:
        connection.execute(text(f'DROP SCHEMA "{TEST_SCHEMA}" CASCADE'))
    test_engine.dispose()


@pytest.fixture(autouse=True)
def clean_state() -> Iterator[None]:
    yield
    tables = ", ".join(f'"{table.name}"' for table in Base.metadata.sorted_tables)
    with test_engine.begin() as connection:
        connection.execute(text(f"TRUNCATE {tables} RESTART IDENTITY CASCADE"))
    login_limiter.clear()


@pytest.fixture
def db() -> Iterator[Session]:
    with TestSession() as session:
        yield session


class ApiUser:
    """Клиент с собственными cookie и токеном: отдельный браузер отдельного пользователя."""

    def __init__(self, name: str) -> None:
        self.client = TestClient(fastapi_app)
        self.email = f"{name}@example.com"
        self.username = name
        self.password = "secret-password"
        response = self.client.post(
            "/api/auth/register",
            json={"email": self.email, "username": self.username, "password": self.password},
        )
        assert response.status_code == 201
        self.token = response.json()["access_token"]
        self.id = response.json()["user"]["id"]

    @property
    def headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self.token}"}

    def request(self, method: str, path: str, **kwargs):
        return self.client.request(method, path, headers=self.headers, **kwargs)


@pytest.fixture
def make_user() -> Callable[[str], ApiUser]:
    return ApiUser


@pytest.fixture
def guest() -> TestClient:
    return TestClient(fastapi_app)
