from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.config import settings
from app.models import RefreshToken
from app.security import generate_refresh_token, hash_refresh_token


def create_refresh_token(db: Session, user_id: int) -> str:
    """Сохраняет хеш нового токена и возвращает сам токен. Коммит делает вызывающий код."""
    now = datetime.now(timezone.utc)
    db.query(RefreshToken).filter(RefreshToken.user_id == user_id, RefreshToken.expires_at < now).delete()

    token = generate_refresh_token()
    db.add(
        RefreshToken(
            user_id=user_id,
            token_hash=hash_refresh_token(token),
            expires_at=now + timedelta(days=settings.refresh_token_expire_days),
        )
    )
    return token


def get_active_refresh_token(db: Session, token: str) -> RefreshToken | None:
    # FOR UPDATE: два параллельных запроса не смогут обменять один токен дважды.
    stored = (
        db.query(RefreshToken)
        .filter(RefreshToken.token_hash == hash_refresh_token(token))
        .with_for_update()
        .first()
    )
    if not stored or stored.revoked_at or stored.expires_at <= datetime.now(timezone.utc):
        return None
    return stored


def revoke_refresh_token(stored: RefreshToken) -> None:
    stored.revoked_at = datetime.now(timezone.utc)
