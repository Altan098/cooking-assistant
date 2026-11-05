from datetime import UTC, datetime, timedelta

import jwt
import pytest
from sqlalchemy import select

from app.core.config import settings
from app.core.security import hash_refresh_token
from app.models import RefreshToken, User


def refresh_cookie(user) -> str:
    return user.client.cookies.get(settings.refresh_cookie_name)


def bearer(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def test_password_is_stored_as_argon2_hash(make_user, db):
    user = make_user("anna")
    stored = db.scalars(select(User).where(User.id == user.id)).one()
    assert stored.hashed_password.startswith("$argon2id$")


def test_refresh_token_is_stored_only_as_hash(make_user, db):
    user = make_user("anna")
    stored = db.scalars(select(RefreshToken).where(RefreshToken.user_id == user.id)).one()
    assert stored.token_hash == hash_refresh_token(refresh_cookie(user))


def test_refresh_cookie_flags(guest):
    response = guest.post(
        "/api/auth/register",
        json={"email": "anna@example.com", "username": "anna", "password": "secret-password"},
    )
    cookie = response.headers["set-cookie"].lower()
    assert "httponly" in cookie
    assert "samesite=lax" in cookie
    assert "path=/api/auth" in cookie


def test_email_is_case_insensitive(make_user, guest):
    make_user("anna")
    response = guest.post("/api/auth/login", json={"email": "ANNA@Example.com", "password": "secret-password"})
    assert response.status_code == 200


@pytest.mark.parametrize(
    "payload",
    [
        {"email": "anna@example.com", "username": "other"},
        {"email": "other@example.com", "username": "anna"},
    ],
)
def test_duplicate_user_is_rejected(make_user, guest, payload):
    make_user("anna")
    response = guest.post("/api/auth/register", json={**payload, "password": "secret-password"})
    assert response.status_code == 409


def test_short_password_is_rejected(guest):
    response = guest.post(
        "/api/auth/register",
        json={"email": "anna@example.com", "username": "anna", "password": "1234567"},
    )
    assert response.status_code == 422


def test_login_errors_do_not_reveal_if_email_exists(make_user, guest):
    make_user("anna")
    wrong_password = guest.post("/api/auth/login", json={"email": "anna@example.com", "password": "wrong"})
    unknown_email = guest.post("/api/auth/login", json={"email": "nobody@example.com", "password": "wrong"})
    assert wrong_password.status_code == unknown_email.status_code == 401
    assert wrong_password.json() == unknown_email.json()


def test_login_is_blocked_after_too_many_failures(make_user, guest):
    make_user("anna")
    wrong = {"email": "anna@example.com", "password": "wrong"}
    for _ in range(settings.login_max_attempts):
        assert guest.post("/api/auth/login", json=wrong).status_code == 401

    blocked = guest.post("/api/auth/login", json={**wrong, "password": "secret-password"})
    assert blocked.status_code == 429
    assert int(blocked.headers["retry-after"]) > 0


def test_successful_login_resets_failures(make_user, guest):
    make_user("anna")
    wrong = {"email": "anna@example.com", "password": "wrong"}
    for _ in range(settings.login_max_attempts - 1):
        guest.post("/api/auth/login", json=wrong)
    assert guest.post("/api/auth/login", json={**wrong, "password": "secret-password"}).status_code == 200
    assert guest.post("/api/auth/login", json=wrong).status_code == 401


def test_protected_route_requires_token(guest):
    assert guest.get("/api/users/me").status_code == 401


def test_current_user(make_user):
    user = make_user("anna")
    response = user.request("GET", "/api/users/me")
    assert response.status_code == 200
    assert response.json()["id"] == user.id
    assert "hashed_password" not in response.json()


@pytest.mark.parametrize(
    ("claims", "secret"),
    [
        ({"type": "access", "exp": datetime.now(UTC) - timedelta(minutes=1)}, settings.jwt_secret_key),
        ({"type": "access", "exp": datetime.now(UTC) + timedelta(minutes=5)}, "x" * 40),
        ({"type": "refresh", "exp": datetime.now(UTC) + timedelta(minutes=5)}, settings.jwt_secret_key),
    ],
    ids=["expired", "wrong-signature", "wrong-type"],
)
def test_invalid_access_token_is_rejected(make_user, guest, claims, secret):
    user = make_user("anna")
    token = jwt.encode({"sub": str(user.id), **claims}, secret, algorithm="HS256")
    assert guest.get("/api/users/me", headers=bearer(token)).status_code == 401


def test_unsigned_token_is_rejected(make_user, guest):
    user = make_user("anna")
    claims = {"sub": str(user.id), "type": "access", "exp": datetime.now(UTC) + timedelta(minutes=5)}
    token = jwt.encode(claims, None, algorithm="none")
    assert guest.get("/api/users/me", headers=bearer(token)).status_code == 401


def test_refresh_rotates_token(make_user, guest):
    user = make_user("anna")
    old_cookie = refresh_cookie(user)

    response = user.client.post("/api/auth/refresh")
    assert response.status_code == 200
    assert refresh_cookie(user) != old_cookie
    assert guest.get("/api/users/me", headers=bearer(response.json()["access_token"])).status_code == 200

    guest.cookies.set(settings.refresh_cookie_name, old_cookie, path=settings.refresh_cookie_path)
    assert guest.post("/api/auth/refresh").status_code == 401


def test_refresh_without_or_with_invalid_cookie(guest):
    assert guest.post("/api/auth/refresh").status_code == 401
    guest.cookies.set(settings.refresh_cookie_name, "garbage", path=settings.refresh_cookie_path)
    assert guest.post("/api/auth/refresh").status_code == 401


def test_expired_refresh_token_is_rejected(make_user, db):
    user = make_user("anna")
    stored = db.scalars(select(RefreshToken).where(RefreshToken.user_id == user.id)).one()
    stored.expires_at = datetime.now(UTC) - timedelta(minutes=1)
    db.commit()
    assert user.client.post("/api/auth/refresh").status_code == 401


def test_logout_revokes_current_session_only(make_user, guest):
    user = make_user("anna")
    second_device = guest
    second_device.post("/api/auth/login", json={"email": user.email, "password": user.password})
    cookie = refresh_cookie(user)

    assert user.client.post("/api/auth/logout").status_code == 204

    user.client.cookies.set(settings.refresh_cookie_name, cookie, path=settings.refresh_cookie_path)
    assert user.client.post("/api/auth/refresh").status_code == 401
    assert second_device.post("/api/auth/refresh").status_code == 200


def test_logout_without_session_succeeds(guest):
    assert guest.post("/api/auth/logout").status_code == 204


def test_change_password_ends_other_sessions(make_user, guest):
    user = make_user("anna")
    guest.post("/api/auth/login", json={"email": user.email, "password": user.password})

    response = user.request(
        "POST",
        "/api/auth/change-password",
        json={"current_password": user.password, "new_password": "new-secret-password"},
    )
    assert response.status_code == 200

    assert guest.post("/api/auth/refresh").status_code == 401
    assert user.client.post("/api/auth/refresh").status_code == 200
    assert guest.post("/api/auth/login", json={"email": user.email, "password": user.password}).status_code == 401
    login = guest.post("/api/auth/login", json={"email": user.email, "password": "new-secret-password"})
    assert login.status_code == 200


def test_change_password_requires_current_password(make_user):
    user = make_user("anna")
    response = user.request(
        "POST",
        "/api/auth/change-password",
        json={"current_password": "wrong", "new_password": "new-secret-password"},
    )
    assert response.status_code == 400


def test_delete_account_requires_password(make_user):
    user = make_user("anna")
    assert user.request("DELETE", "/api/users/me", json={"password": "wrong"}).status_code == 400
    assert user.request("GET", "/api/users/me").status_code == 200


def test_delete_account_removes_user_data(make_user, guest, db):
    user = make_user("anna")
    recipe = user.request("POST", "/api/recipes/", json={"title": "Суп"}).json()
    user.request("POST", "/api/shopping-list/", json={"name": "Хлеб"})
    user.request("PUT", "/api/meal-plan/0/lunch", json={"recipe_id": recipe["id"]})

    assert user.request("DELETE", "/api/users/me", json={"password": user.password}).status_code == 204

    assert user.request("GET", "/api/users/me").status_code == 401
    assert guest.get(f"/api/recipes/{recipe['id']}").status_code == 404
    assert db.scalars(select(RefreshToken).where(RefreshToken.user_id == user.id)).first() is None
