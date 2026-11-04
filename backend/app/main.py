from fastapi import FastAPI

from app.routers import auth, ingredients, meal_plan, recipes, shopping_list, users

app = FastAPI(
    title="Cooking Assistant API",
    version="0.3.0",
    description="Backend для приложения «Ассистент повара»",
)

API_PREFIX = "/api"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(ingredients.router, prefix=API_PREFIX)
app.include_router(recipes.router, prefix=API_PREFIX)
app.include_router(shopping_list.router, prefix=API_PREFIX)
app.include_router(meal_plan.router, prefix=API_PREFIX)


@app.get("/")
def root():
    return {"message": "Cooking Assistant API is running"}
