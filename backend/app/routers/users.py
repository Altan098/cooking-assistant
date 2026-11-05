from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.images import delete_image
from app.core.security import verify_password
from app.crud import user as crud_user
from app.dependencies import get_current_user
from app.models import User
from app.schemas import AccountDelete, UserRead

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserRead)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    data: AccountDelete,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный пароль")
    image_urls = [recipe.image_url for recipe in current_user.recipes]
    crud_user.delete_user(db, current_user)
    for image_url in image_urls:
        delete_image(image_url)
    response.delete_cookie(settings.refresh_cookie_name, path=settings.refresh_cookie_path)
