from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.config import settings
from app.crud import refresh_token as crud_refresh_token
from app.crud import user as crud_user
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import AuthResponse, UserCreate, UserLogin, UserRead
from app.security import DUMMY_PASSWORD_HASH, create_access_token, verify_password

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
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Пользователь уже существует")
    return start_session(response, db, user)


@router.post("/login", response_model=AuthResponse)
def login(data: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = crud_user.get_user_by_email(db, data.email)
    password_ok = verify_password(data.password, user.hashed_password if user else DUMMY_PASSWORD_HASH)
    if not user or not password_ok:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный email или пароль")
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


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user
