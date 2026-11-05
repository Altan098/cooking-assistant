from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.images import MAX_IMAGE_BYTES, InvalidImageError, delete_image, save_image
from app.crud import recipe as crud_recipe
from app.dependencies import get_current_user
from app.models import Recipe, User
from app.schemas import RecipeCreate, RecipePage, RecipeRead, RecipeUpdate

router = APIRouter(prefix="/recipes", tags=["recipes"])


def get_own_recipe(recipe_id: int, current_user: User, db: Session) -> Recipe:
    recipe = crud_recipe.get_recipe(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Рецепт не найден")
    if recipe.author_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Изменять рецепт может только его автор")
    return recipe


@router.get("/", response_model=RecipePage)
def list_recipes(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=12, ge=1, le=100),
    ingredient: str | None = Query(default=None, max_length=100),
    author_id: int | None = None,
    db: Session = Depends(get_db),
):
    return RecipePage(
        items=crud_recipe.get_recipes(db, skip=skip, limit=limit, ingredient=ingredient, author_id=author_id),
        total=crud_recipe.count_recipes(db, ingredient=ingredient, author_id=author_id),
    )


@router.get("/{recipe_id}", response_model=RecipeRead)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = crud_recipe.get_recipe(db, recipe_id)
    if not recipe:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Рецепт не найден")
    return recipe


@router.post("/", response_model=RecipeRead, status_code=status.HTTP_201_CREATED)
def create_recipe(
    data: RecipeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return crud_recipe.create_recipe(db, data, author_id=current_user.id)


@router.patch("/{recipe_id}", response_model=RecipeRead)
def update_recipe(
    recipe_id: int,
    data: RecipeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = get_own_recipe(recipe_id, current_user, db)
    return crud_recipe.update_recipe(db, recipe, data)


@router.put("/{recipe_id}/image", response_model=RecipeRead)
def upload_recipe_image(
    recipe_id: int,
    image: UploadFile = File(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = get_own_recipe(recipe_id, current_user, db)

    data = image.file.read(MAX_IMAGE_BYTES + 1)
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=status.HTTP_413_CONTENT_TOO_LARGE, detail="Файл больше 5 МБ")
    try:
        image_url = save_image(data)
    except InvalidImageError:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Загрузите изображение JPEG, PNG или WebP",
        ) from None

    previous_url = recipe.image_url
    recipe = crud_recipe.set_recipe_image(db, recipe, image_url)
    delete_image(previous_url)
    return recipe


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recipe(
    recipe_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = get_own_recipe(recipe_id, current_user, db)
    image_url = recipe.image_url
    crud_recipe.delete_recipe(db, recipe)
    delete_image(image_url)
