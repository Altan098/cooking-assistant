from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import user as crud_user
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import UserRead

router = APIRouter(prefix="/users", tags=["users"])


def require_self(user_id: int, current_user: User) -> None:
    if user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Доступ только к своему аккаунту")


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, current_user: User = Depends(get_current_user)):
    require_self(user_id, current_user)
    return current_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    require_self(user_id, current_user)
    crud_user.delete_user(db, current_user)
