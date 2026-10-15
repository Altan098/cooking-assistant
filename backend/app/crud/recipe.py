from sqlalchemy.orm import Session

from app.models import Recipe, RecipeIngredient, Step
from app.schemas import RecipeCreate, RecipeUpdate


def get_recipe(db: Session, recipe_id: int) -> Recipe | None:
    return db.get(Recipe, recipe_id)


def get_recipes(db: Session, skip: int = 0, limit: int = 100) -> list[Recipe]:
    return db.query(Recipe).offset(skip).limit(limit).all()


def create_recipe(db: Session, data: RecipeCreate) -> Recipe:
    recipe = Recipe(
        title=data.title,
        description=data.description,
        image_url=data.image_url,
        cooking_time=data.cooking_time,
        servings=data.servings,
        author_id=data.author_id,
    )
    db.add(recipe)
    db.flush()

    for item in data.ingredients:
        db.add(RecipeIngredient(recipe_id=recipe.id, ingredient_id=item.ingredient_id, amount=item.amount))

    for step in data.steps:
        db.add(Step(recipe_id=recipe.id, order=step.order, text=step.text))

    db.commit()
    db.refresh(recipe)
    return recipe


def update_recipe(db: Session, recipe_id: int, data: RecipeUpdate) -> Recipe | None:
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(recipe, field, value)
    db.commit()
    db.refresh(recipe)
    return recipe


def delete_recipe(db: Session, recipe_id: int) -> bool:
    recipe = db.get(Recipe, recipe_id)
    if not recipe:
        return False
    db.delete(recipe)
    db.commit()
    return True