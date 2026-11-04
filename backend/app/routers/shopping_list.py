from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import shopping_item as crud_shopping
from app.database import get_db
from app.dependencies import get_current_user
from app.models import ShoppingItem, User
from app.schemas import ShoppingItemCreate, ShoppingItemRead, ShoppingItemUpdate

router = APIRouter(prefix="/shopping-list", tags=["shopping-list"])


def get_own_item(item_id: int, current_user: User, db: Session) -> ShoppingItem:
    # Чужая запись выглядит как несуществующая: список покупок приватный.
    item = crud_shopping.get_item(db, item_id, current_user.id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Продукт не найден")
    return item


@router.get("/", response_model=list[ShoppingItemRead])
def list_items(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud_shopping.get_items(db, current_user.id)


@router.post("/", response_model=ShoppingItemRead, status_code=status.HTTP_201_CREATED)
def create_item(
    data: ShoppingItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud_shopping.create_item(db, data.name, current_user.id)


@router.patch("/{item_id}", response_model=ShoppingItemRead)
def update_item(
    item_id: int,
    data: ShoppingItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud_shopping.set_done(db, get_own_item(item_id, current_user, db), data.done)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    crud_shopping.delete_item(db, get_own_item(item_id, current_user, db))
