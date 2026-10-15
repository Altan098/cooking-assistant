from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import ingredient as crud_ingredient
from app.database import get_db
from app.schemas import IngredientCreate, IngredientRead

router = APIRouter(prefix="/ingredients", tags=["ingredients"])


@router.get("/", response_model=list[IngredientRead])
def list_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_ingredient.get_ingredients(db, skip=skip, limit=limit)


@router.get("/{ingredient_id}", response_model=IngredientRead)
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ingredient = crud_ingredient.get_ingredient(db, ingredient_id)
    if not ingredient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")
    return ingredient


@router.post("/", response_model=IngredientRead, status_code=status.HTTP_201_CREATED)
def create_ingredient(data: IngredientCreate, db: Session = Depends(get_db)):
    if crud_ingredient.get_ingredient_by_name(db, data.name):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ingredient already exists")
    return crud_ingredient.create_ingredient(db, data)


@router.delete("/{ingredient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    if not crud_ingredient.delete_ingredient(db, ingredient_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingredient not found")