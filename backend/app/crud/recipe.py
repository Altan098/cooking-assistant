from sqlalchemy.orm import Session, selectinload

from app.crud.ingredient import get_or_create_ingredient
from app.models import Ingredient, Recipe, RecipeIngredient, Step
from app.schemas import RecipeCreate, RecipeIngredientBase, RecipeUpdate, StepBase

LOAD_RELATIONS = (
    selectinload(Recipe.ingredients).selectinload(RecipeIngredient.ingredient),
    selectinload(Recipe.steps),
)


def escape_like(value: str) -> str:
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


def build_ingredients(db: Session, items: list[RecipeIngredientBase]) -> list[RecipeIngredient]:
    return [
        RecipeIngredient(ingredient=get_or_create_ingredient(db, item.name), amount=item.amount)
        for item in items
    ]


def build_steps(items: list[StepBase]) -> list[Step]:
    return [Step(order=item.order, text=item.text) for item in items]


def get_recipe(db: Session, recipe_id: int) -> Recipe | None:
    return db.get(Recipe, recipe_id)


def get_recipes(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    ingredient: str | None = None,
    author_id: int | None = None,
) -> list[Recipe]:
    query = db.query(Recipe).options(*LOAD_RELATIONS)
    if author_id is not None:
        query = query.filter(Recipe.author_id == author_id)
    if ingredient:
        pattern = f"%{escape_like(ingredient)}%"
        query = query.filter(
            Recipe.ingredients.any(RecipeIngredient.ingredient.has(Ingredient.name.ilike(pattern, escape="\\")))
        )
    return query.order_by(Recipe.created_at.desc(), Recipe.id.desc()).offset(skip).limit(limit).all()


def create_recipe(db: Session, data: RecipeCreate, author_id: int) -> Recipe:
    recipe = Recipe(
        title=data.title,
        description=data.description,
        image_url=data.image_url,
        cooking_time=data.cooking_time,
        servings=data.servings,
        author_id=author_id,
        ingredients=build_ingredients(db, data.ingredients),
        steps=build_steps(data.steps),
    )
    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe


def update_recipe(db: Session, recipe: Recipe, data: RecipeUpdate) -> Recipe:
    fields = data.model_dump(exclude_unset=True, exclude_none=True, exclude={"ingredients", "steps"})
    for field, value in fields.items():
        setattr(recipe, field, value)
    if data.ingredients is not None:
        recipe.ingredients = build_ingredients(db, data.ingredients)
    if data.steps is not None:
        recipe.steps = build_steps(data.steps)
    db.commit()
    db.refresh(recipe)
    return recipe


def delete_recipe(db: Session, recipe: Recipe) -> None:
    db.delete(recipe)
    db.commit()
