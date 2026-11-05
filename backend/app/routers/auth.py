from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.rate_limit import login_limiter
from app.core.security import DUMMY_PASSWORD_HASH, create_access_token, hash_password, verify_password
from app.crud import refresh_token as crud_refresh_token
from app.crud import user as crud_user
from app.dependencies import get_current_user
from app.models import User
from app.schemas import AuthResponse, PasswordChange, UserCreate, UserLogin, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


def set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=token,
        max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
        path=settings.refresh_cookie_path,
        httponly=True,
        secure=settings.refresh_cookie_secure,
        samesite="lax",
    )


def start_session(response: Response, db: Session, user: User) -> AuthResponse:
    refresh_token = crud_refresh_token.create_refresh_token(db, user.id)
    db.commit()
    set_refresh_cookie(response, refresh_token)
    return AuthResponse(access_token=create_access_token(user.id), user=UserRead.model_validate(user))


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, response: Response, db: Session = Depends(get_db)):
    if crud_user.get_user_by_email(db, data.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Этот email уже зарегистрирован")
    if crud_user.get_user_by_username(db, data.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Это имя пользователя уже занято")
    try:
        user = crud_user.create_user(db, data)
    except IntegrityError:
        # Параллельная регистрация успела занять email или имя между проверкой и записью.
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Пользователь уже существует") from None
    return start_session(response, db, user)


@router.post("/login", response_model=AuthResponse)
def login(data: UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "unknown"
    limiter_key = f"{client_ip}:{data.email}"

    retry_after = login_limiter.retry_after(limiter_key)
    if retry_after:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много попыток входа. Попробуйте позже",
            headers={"Retry-After": str(retry_after)},
        )

    user = crud_user.get_user_by_email(db, data.email)
    password_ok = verify_password(data.password, user.hashed_password if user else DUMMY_PASSWORD_HASH)
    if not user or not password_ok:
        login_limiter.record_failure(limiter_key)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль")

    login_limiter.reset(limiter_key)
    return start_session(response, db, user)


@router.post("/refresh", response_model=AuthResponse)
def refresh(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias=settings.refresh_cookie_name),
    db: Session = Depends(get_db),
):
    stored = crud_refresh_token.get_active_refresh_token(db, refresh_token) if refresh_token else None
    if stored is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Сессия истекла, войдите снова")

    # Ротация: каждый refresh token работает один раз.
    crud_refresh_token.revoke_refresh_token(stored)
    return start_session(response, db, stored.user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    refresh_token: str | None = Cookie(default=None, alias=settings.refresh_cookie_name),
    db: Session = Depends(get_db),
):
    stored = crud_refresh_token.get_active_refresh_token(db, refresh_token) if refresh_token else None
    if stored is not None:
        crud_refresh_token.revoke_refresh_token(stored)
        db.commit()
    response.delete_cookie(settings.refresh_cookie_name, path=settings.refresh_cookie_path)


@router.post("/change-password", response_model=AuthResponse)
def change_password(
    data: PasswordChange,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный текущий пароль")

    current_user.hashed_password = hash_password(data.new_password)
    # Если пароль меняют из-за утечки, все остальные сессии должны закончиться.
    crud_refresh_token.revoke_all_refresh_tokens(db, current_user.id)
    return start_session(response, db, current_user)
