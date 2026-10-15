from fastapi import FastAPI

from app.routers import ingredients, recipes, users

app = FastAPI(
    title="Cooking Assistant API",
    version="0.1.0",
    description="Backend для приложения «Ассистент повара»",
)

app.include_router(users.router)
app.include_router(ingredients.router)
app.include_router(recipes.router)


@app.get("/")
def root():
    return {"message": "Cooking Assistant API is running"}