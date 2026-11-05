from io import BytesIO
from pathlib import Path

from PIL import Image

from app.core.config import settings
from app.core.images import MAX_IMAGE_BYTES


def make_image(image_format="JPEG", size=(300, 200), mode="RGB", **options) -> bytes:
    buffer = BytesIO()
    Image.new(mode, size, "tomato").save(buffer, format=image_format, **options)
    return buffer.getvalue()


def create_recipe(user, title="Суп"):
    return user.request("POST", "/api/recipes/", json={"title": title}).json()


def upload(user, recipe_id, data=None, content_type="image/jpeg"):
    files = {"image": ("photo.jpg", make_image() if data is None else data, content_type)}
    return user.request("PUT", f"/api/recipes/{recipe_id}/image", files=files)


def stored_path(image_url: str) -> Path:
    return Path(settings.upload_dir) / Path(image_url).name


def test_upload_saves_image_and_serves_it(make_user, guest):
    anna = make_user("anna")
    recipe = create_recipe(anna)

    response = upload(anna, recipe["id"])

    assert response.status_code == 200
    image_url = response.json()["image_url"]
    assert image_url.startswith("/api/uploads/")
    served = guest.get(image_url)
    assert served.status_code == 200
    assert served.headers["content-type"] == "image/jpeg"
    assert guest.get(f"/api/recipes/{recipe['id']}").json()["image_url"] == image_url


def test_png_and_webp_are_converted_to_jpeg(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    for data in (make_image("PNG", mode="RGBA"), make_image("WEBP")):
        image_url = upload(anna, recipe["id"], data).json()["image_url"]
        assert Image.open(stored_path(image_url)).format == "JPEG"


def test_large_image_is_resized(make_user):
    anna = make_user("anna")
    image_url = upload(anna, create_recipe(anna)["id"], make_image(size=(3200, 1600))).json()["image_url"]
    assert Image.open(stored_path(image_url)).size == (1600, 800)


def test_metadata_is_removed(make_user):
    anna = make_user("anna")
    exif = Image.Exif()
    exif[0x010E] = "secret location"
    image_url = upload(anna, create_recipe(anna)["id"], make_image(exif=exif)).json()["image_url"]
    assert not Image.open(stored_path(image_url)).getexif()


def test_file_that_is_not_an_image_is_rejected(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    assert upload(anna, recipe["id"], b"<script>alert(1)</script>", "image/jpeg").status_code == 415
    assert upload(anna, recipe["id"], make_image("GIF"), "image/gif").status_code == 415


def test_too_large_file_is_rejected(make_user):
    anna = make_user("anna")
    assert upload(anna, create_recipe(anna)["id"], b"x" * (MAX_IMAGE_BYTES + 1)).status_code == 413


def test_only_author_can_upload(make_user, guest):
    anna, boris = make_user("anna"), make_user("boris")
    recipe = create_recipe(anna)
    files = {"image": ("photo.jpg", make_image(), "image/jpeg")}
    assert guest.put(f"/api/recipes/{recipe['id']}/image", files=files).status_code == 401
    assert upload(boris, recipe["id"]).status_code == 403
    assert upload(anna, 999).status_code == 404


def test_new_image_replaces_old_file(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    first = upload(anna, recipe["id"]).json()["image_url"]
    second = upload(anna, recipe["id"]).json()["image_url"]
    assert first != second
    assert not stored_path(first).exists()
    assert stored_path(second).exists()


def test_deleting_recipe_removes_file(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    image_url = upload(anna, recipe["id"]).json()["image_url"]
    anna.request("DELETE", f"/api/recipes/{recipe['id']}")
    assert not stored_path(image_url).exists()


def test_deleting_account_removes_files(make_user):
    anna = make_user("anna")
    image_url = upload(anna, create_recipe(anna)["id"]).json()["image_url"]
    anna.request("DELETE", "/api/users/me", json={"password": anna.password})
    assert not stored_path(image_url).exists()


def test_image_url_cannot_be_set_directly(make_user):
    anna = make_user("anna")
    created = anna.request("POST", "/api/recipes/", json={"title": "Суп", "image_url": "https://evil.example/x.jpg"})
    assert created.json()["image_url"] == ""

    recipe_id = created.json()["id"]
    updated = anna.request("PATCH", f"/api/recipes/{recipe_id}", json={"image_url": "https://evil.example/x.jpg"})
    assert updated.json()["image_url"] == ""
