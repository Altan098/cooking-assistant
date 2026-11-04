import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError

from app.config import settings

password_hasher = PasswordHasher()

# Проверяется, когда пользователь не найден, чтобы время ответа на вход
# не выдавало, зарегистрирован ли email.
DUMMY_PASSWORD_HASH = password_hasher.hash(secrets.token_urlsafe(16))


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return password_hasher.verify(hashed_password, password)
    except (VerificationError, InvalidHashError):
        return False


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> int | None:
    """Возвращает id пользователя или None, если токен недействителен."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
            options={"require": ["exp", "sub"]},
        )
        if payload.get("type") != "access":
            return None
        return int(payload["sub"])
    except (jwt.InvalidTokenError, ValueError):
        return None


def generate_refresh_token() -> str:
    return secrets.token_urlsafe(48)


def hash_refresh_token(token: str) -> str:
    # Токен случайный и длинный, поэтому достаточно быстрого хеша:
    # утечка таблицы не даёт действующих токенов.
    return hashlib.sha256(token.encode()).hexdigest()
