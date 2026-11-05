from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import configure_logging
from app.routers import auth, health, ingredients, meal_plan, recipes, shopping_list, users

API_PREFIX = "/api"

configure_logging()

app = FastAPI(
    title="Cooking Assistant API",
    version="1.0.0",
    description="Backend для приложения «Ассистент повара»",
    # В production документация API не публикуется.
    docs_url=None if settings.is_production else "/docs",
    redoc_url=None,
    openapi_url=None if settings.is_production else "/openapi.json",
)

for module in (health, auth, users, ingredients, recipes, shopping_list, meal_plan):
    app.include_router(module.router, prefix=API_PREFIX)
