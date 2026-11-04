from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import ingredient as crud_ingredient
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import IngredientCreate, IngredientRead

router = APIRouter(prefix="/ingredients", tags=["ingredients"])


@router.get("/", response_model=list[IngredientRead])
def list_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_ingredient.get_ingredients(db, skip=skip, limit=limit)


@router.get("/{ingredient_id}", response_model=IngredientRead)
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ingredient = crud_ingredient.get_ingredient(db, ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ингредиент не найден")
    return ingredient


@router.post("/", response_model=IngredientRead, status_code=status.HTTP_201_CREATED)
def create_ingredient(
    data: IngredientCreate,
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if crud_ingredient.get_ingredient_by_name(db, data.name):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Такой ингредиент уже есть")
    return crud_ingredient.create_ingredient(db, data)


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ingredient(
    ingredient_id: int,
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Справочник общий: удаление не должно ломать чужие рецепты.
    ingredient = crud_ingredient.get_ingredient(db, ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ингредиент не найден")
    if crud_ingredient.is_ingredient_used(db, ingredient_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ингредиент используется в рецептах")
    crud_ingredient.delete_ingredient(db, ingredient)
