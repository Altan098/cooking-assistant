from logging.config import fileConfig

from alembic import context

import app.models  # noqa: F401  (регистрирует таблицы в Base.metadata)
from app.core.database import Base, engine

if context.config.config_file_name is not None:
    fileConfig(context.config.config_file_name)


def run_migrations() -> None:
    # Подключение берём из настроек приложения: адрес БД задаётся в одном месте.
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=Base.metadata)
        with context.begin_transaction():
            context.run_migrations()


run_migrations()
