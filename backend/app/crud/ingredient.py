from sqlalchemy.orm import Session

from app.models import Ingredient, RecipeIngredient
from app.schemas import IngredientCreate


def get_ingredient(db: Session, ingredient_id: int) -> Ingredient | None:
    return db.get(Ingredient, ingredient_id)


def get_ingredient_by_name(db: Session, name: str) -> Ingredient | None:
    return db.query(Ingredient).filter(Ingredient.name == name).first()


def get_ingredients(db: Session, skip: int = 0, limit: int = 100) -> list[Ingredient]:
    return db.query(Ingredient).offset(skip).limit(limit).all()


def create_ingredient(db: Session, data: IngredientCreate) -> Ingredient:
    ingredient = Ingredient(name=data.name)
    db.add(ingredient)
    db.commit()
    db.refresh(ingredient)
    return ingredient


def is_ingredient_used(db: Session, ingredient_id: int) -> bool:
    return db.query(RecipeIngredient.id).filter(RecipeIngredient.ingredient_id == ingredient_id).first() is not None


def delete_ingredient(db: Session, ingredient: Ingredient) -> None:
    db.delete(ingredient)
    db.commit()