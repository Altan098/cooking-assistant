from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class RecipeIngredientBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    amount: str = Field(min_length=1, max_length=100)

    model_config = ConfigDict(str_strip_whitespace=True)


class RecipeIngredientRead(RecipeIngredientBase):
    id: int
    ingredient_id: int

    model_config = ConfigDict(from_attributes=True)


class StepBase(BaseModel):
    order: int = Field(ge=0)
    text: str = Field(min_length=1)

    model_config = ConfigDict(str_strip_whitespace=True)


class StepRead(StepBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class RecipeBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = ""
    image_url: str = Field(default="", max_length=500)
    cooking_time: int = Field(default=0, ge=0, le=100000)
    servings: int = Field(default=1, ge=1, le=1000)

    model_config = ConfigDict(str_strip_whitespace=True)


class RecipeCreate(RecipeBase):
    ingredients: list[RecipeIngredientBase] = []
    steps: list[StepBase] = []


class RecipeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    cooking_time: int | None = Field(default=None, ge=0, le=100000)
    servings: int | None = Field(default=None, ge=1, le=1000)
    ingredients: list[RecipeIngredientBase] | None = None
    steps: list[StepBase] | None = None

    model_config = ConfigDict(str_strip_whitespace=True)


class RecipeRead(RecipeBase):
    id: int
    author_id: int
    created_at: datetime
    ingredients: list[RecipeIngredientRead] = []
    steps: list[StepRead] = []

    model_config = ConfigDict(from_attributes=True)
