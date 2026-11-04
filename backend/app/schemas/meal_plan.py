from typing import Literal

from pydantic import BaseModel, ConfigDict

MealType = Literal["breakfast", "lunch", "dinner"]


class MealPlanSet(BaseModel):
    recipe_id: int


class MealPlanRecipe(BaseModel):
    id: int
    title: str

    model_config = ConfigDict(from_attributes=True)


class MealPlanEntryRead(BaseModel):
    day: int
    meal: MealType
    recipe: MealPlanRecipe

    model_config = ConfigDict(from_attributes=True)
