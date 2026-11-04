from sqlalchemy import func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from app.models import Ingredient, RecipeIngredient
from app.schemas import IngredientCreate


def get_ingredient(db: Session, ingredient_id: int) -> Ingredient | None:
    return db.get(Ingredient, ingredient_id)


def get_ingredient_by_name(db: Session, name: str) -> Ingredient | None:
    return db.query(Ingredient).filter(func.lower(Ingredient.name) == name.lower()).first()


def get_or_create_ingredient(db: Session, name: str) -> Ingredient:
    ingredient = get_ingredient_by_name(db, name)
    if ingredient:
        return ingredient
    # ON CONFLICT: параллельный запрос мог уже добавить такое же имя.
    db.execute(insert(Ingredient).values(name=name).on_conflict_do_nothing(index_elements=["name"]))
    return db.query(Ingredient).filter(Ingredient.name == name).one()


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
