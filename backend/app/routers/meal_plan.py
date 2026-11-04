from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.orm import Session

from app.crud import meal_plan as crud_meal_plan
from app.crud import recipe as crud_recipe
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import MealPlanEntryRead, MealPlanSet, MealType

router = APIRouter(prefix="/meal-plan", tags=["meal-plan"])


@router.get("/", response_model=list[MealPlanEntryRead])
def list_entries(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud_meal_plan.get_entries(db, current_user.id)


@router.put("/{day}/{meal}", response_model=MealPlanEntryRead)
def set_entry(
    meal: MealType,
    data: MealPlanSet,
    day: int = Path(ge=0, le=6),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not crud_recipe.get_recipe(db, data.recipe_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Рецепт не найден")
    return crud_meal_plan.set_entry(db, current_user.id, day, meal, data.recipe_id)


@router.delete("/{day}/{meal}", status_code=status.HTTP_204_NO_CONTENT)
def delete_entry(
    meal: MealType,
    day: int = Path(ge=0, le=6),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    entry = crud_meal_plan.get_entry(db, current_user.id, day, meal)
    if not entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Запись не найдена")
    crud_meal_plan.delete_entry(db, entry)
