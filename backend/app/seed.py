"""Наполняет БД демонстрационными рецептами. Запуск: python -m app.seed

Повторный запуск безопасен: уже добавленные рецепты не дублируются.
"""
import json
import sys
from pathlib import Path

from app.config import settings
from app.crud import recipe as crud_recipe
from app.crud import user as crud_user
from app.database import SessionLocal
from app.schemas import RecipeCreate, UserCreate

DEMO_EMAIL = "demo@example.com"
DEMO_USERNAME = "demo_cook"
RECIPES_FILE = Path(__file__).with_name("seed_recipes.json")


def main() -> None:
    if not settings.seed_user_password:
        sys.exit("Укажите SEED_USER_PASSWORD в файле .env")

    recipes = json.loads(RECIPES_FILE.read_text(encoding="utf-8"))

    with SessionLocal() as db:
        user = crud_user.get_user_by_email(db, DEMO_EMAIL)
        if user is None:
            user = crud_user.create_user(
                db,
                UserCreate(email=DEMO_EMAIL, username=DEMO_USERNAME, password=settings.seed_user_password),
            )

        existing = {recipe.title for recipe in crud_recipe.get_recipes(db, limit=1000, author_id=user.id)}
        new_recipes = [recipe for recipe in recipes if recipe["title"] not in existing]
        for recipe in new_recipes:
            crud_recipe.create_recipe(db, RecipeCreate(**recipe), author_id=user.id)

    print(f"Добавлено рецептов: {len(new_recipes)}. Демо-пользователь: {DEMO_EMAIL}")


if __name__ == "__main__":
    main()
