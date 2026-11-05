import logging
import uuid
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps, UnidentifiedImageError

from app.core.config import settings

logger = logging.getLogger(__name__)

UPLOADS_URL = "/api/uploads"
MAX_IMAGE_BYTES = 5 * 1024 * 1024
MAX_IMAGE_SIDE = 1600
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}

# Маленький файл может распаковаться в огромную картинку и занять всю память.
Image.MAX_IMAGE_PIXELS = 40_000_000


class InvalidImageError(Exception):
    pass


def save_image(data: bytes) -> str:
    """Проверяет картинку, кодирует её заново и возвращает адрес файла.

    Новое кодирование гарантирует, что на диск попадёт только изображение:
    посторонние данные и метаданные с геолокацией из исходного файла не сохраняются.
    """
    try:
        image = Image.open(BytesIO(data))
        if image.format not in ALLOWED_FORMATS:
            raise InvalidImageError
        image.load()
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError, Image.DecompressionBombError) as error:
        raise InvalidImageError from error

    image = ImageOps.exif_transpose(image)
    image.thumbnail((MAX_IMAGE_SIDE, MAX_IMAGE_SIDE))

    # В JPEG нет прозрачности, поэтому прозрачные области заливаются белым.
    rgba = image.convert("RGBA")
    result = Image.new("RGB", rgba.size, "white")
    result.paste(rgba, mask=rgba.getchannel("A"))

    filename = f"{uuid.uuid4().hex}.jpg"
    result.save(Path(settings.upload_dir) / filename, format="JPEG", quality=85, optimize=True)
    return f"{UPLOADS_URL}/{filename}"


def delete_image(image_url: str) -> None:
    """Удаляет загруженный файл. Адреса демонстрационных картинок не затрагиваются."""
    if not image_url.startswith(f"{UPLOADS_URL}/"):
        return
    try:
        (Path(settings.upload_dir) / Path(image_url).name).unlink(missing_ok=True)
    except OSError:
        logger.exception("Не удалось удалить файл %s", image_url)
