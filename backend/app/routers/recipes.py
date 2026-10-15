from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.crud import recipe as crud_recipe
from app.crud import user as crud_user
from app.database import get_db
from app.schemas import RecipeCreate, RecipeRead, RecipeUpdate

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/", response_model=list[RecipeRead])
def list_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud_recipe.get_recipes(db, skip=skip, limit=limit)


@router.get("/{recipe_id}", response_model=RecipeRead)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = crud_recipe.get_recipe(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


@router.post("/", response_model=RecipeRead, status_code=status.HTTP_201_CREATED)
def create_recipe(data: RecipeCreate, db: Session = Depends(get_db)):
    if not crud_user.get_user(db, data.author_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Author not found")
    return crud_recipe.create_recipe(db, data)


@router.patch("/{recipe_id}", response_model=RecipeRead)
def update_recipe(recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db)):
    recipe = crud_recipe.update_recipe(db, recipe_id, data)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    if not crud_recipe.delete_recipe(db, recipe_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recipe not found")