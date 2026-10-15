from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecipeIngredientBase(BaseModel):
    ingredient_id: int
    amount: str = Field(min_length=1, max_length=100)


class RecipeIngredientRead(RecipeIngredientBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class StepBase(BaseModel):
    order: int = Field(ge=0)
    text: str = Field(min_length=1)


class StepRead(StepBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class RecipeBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    image_url: str = ""
    cooking_time: int = Field(default=0, ge=0)
    servings: int = Field(default=1, ge=1)


class RecipeCreate(RecipeBase):
    author_id: int
    ingredients: list[RecipeIngredientBase] = []
    steps: list[StepBase] = []


class RecipeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    image_url: str | None = None
    cooking_time: int | None = Field(default=None, ge=0)
    servings: int | None = Field(default=None, ge=1)


class RecipeRead(RecipeBase):
    id: int
    author_id: int
    created_at: datetime
    ingredients: list[RecipeIngredientRead] = []
    steps: list[StepRead] = []

    model_config = ConfigDict(from_attributes=True)