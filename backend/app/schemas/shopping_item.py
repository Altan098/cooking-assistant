from pydantic import BaseModel, ConfigDict, Field


class ShoppingItemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)

    model_config = ConfigDict(str_strip_whitespace=True)


class ShoppingItemUpdate(BaseModel):
    done: bool


class ShoppingItemRead(BaseModel):
    id: int
    name: str
    done: bool

    model_config = ConfigDict(from_attributes=True)
