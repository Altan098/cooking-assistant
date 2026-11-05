RECIPE = {
    "title": "  Плов ",
    "description": "Сытно",
    "cooking_time": 40,
    "servings": 4,
    "ingredients": [{"name": " Рис ", "amount": "2 стакана"}, {"name": "Морковь", "amount": "2 шт"}],
    "steps": [{"order": 0, "text": "Обжарить"}, {"order": 1, "text": "Томить"}],
}


def create_recipe(user, **overrides):
    response = user.request("POST", "/api/recipes/", json={**RECIPE, **overrides})
    assert response.status_code == 201
    return response.json()


def test_create_recipe_uses_author_from_token(make_user):
    anna, boris = make_user("anna"), make_user("boris")
    recipe = create_recipe(anna, author_id=boris.id)
    assert recipe["author_id"] == anna.id


def test_create_recipe_normalizes_text_and_keeps_order(make_user):
    recipe = create_recipe(make_user("anna"))
    assert recipe["title"] == "Плов"
    assert [item["name"] for item in recipe["ingredients"]] == ["Рис", "Морковь"]
    assert [step["text"] for step in recipe["steps"]] == ["Обжарить", "Томить"]


def test_ingredient_name_is_reused_case_insensitively(make_user, guest):
    anna = make_user("anna")
    first = create_recipe(anna, ingredients=[{"name": "Рис", "amount": "1"}])
    second = create_recipe(anna, ingredients=[{"name": "рис", "amount": "2"}])
    assert first["ingredients"][0]["ingredient_id"] == second["ingredients"][0]["ingredient_id"]
    assert len(guest.get("/api/ingredients/").json()) == 1


def test_guest_can_read_but_not_write(make_user, guest):
    recipe = create_recipe(make_user("anna"))
    assert guest.get("/api/recipes/").status_code == 200
    assert guest.get(f"/api/recipes/{recipe['id']}").status_code == 200
    assert guest.post("/api/recipes/", json=RECIPE).status_code == 401
    assert guest.patch(f"/api/recipes/{recipe['id']}", json={"title": "X"}).status_code == 401
    assert guest.delete(f"/api/recipes/{recipe['id']}").status_code == 401


def test_only_author_can_change_recipe(make_user):
    anna, boris = make_user("anna"), make_user("boris")
    recipe = create_recipe(anna)
    assert boris.request("PATCH", f"/api/recipes/{recipe['id']}", json={"title": "X"}).status_code == 403
    assert boris.request("DELETE", f"/api/recipes/{recipe['id']}").status_code == 403
    assert anna.request("PATCH", f"/api/recipes/{recipe['id']}", json={"title": "Плов 2"}).status_code == 200
    assert anna.request("DELETE", f"/api/recipes/{recipe['id']}").status_code == 204


def test_missing_recipe_returns_404(make_user, guest):
    anna = make_user("anna")
    assert guest.get("/api/recipes/999").status_code == 404
    assert anna.request("PATCH", "/api/recipes/999", json={"title": "X"}).status_code == 404
    assert anna.request("DELETE", "/api/recipes/999").status_code == 404


def test_update_replaces_ingredients_and_steps(make_user, guest):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    anna.request(
        "PATCH",
        f"/api/recipes/{recipe['id']}",
        json={"ingredients": [{"name": "Вода", "amount": "1 л"}], "steps": [{"order": 0, "text": "Вскипятить"}]},
    )
    saved = guest.get(f"/api/recipes/{recipe['id']}").json()
    assert [item["name"] for item in saved["ingredients"]] == ["Вода"]
    assert [step["text"] for step in saved["steps"]] == ["Вскипятить"]


def test_update_ignores_null_fields(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    response = anna.request("PATCH", f"/api/recipes/{recipe['id']}", json={"title": None})
    assert response.status_code == 200
    assert response.json()["title"] == "Плов"


def test_invalid_recipe_data_is_rejected(make_user):
    anna = make_user("anna")
    for payload in (
        {"title": "   "},
        {"title": "Суп", "image_url": "x" * 501},
        {"title": "Суп", "servings": 0},
        {"title": "Суп", "description": "x" * 5001},
        {"title": "Суп", "steps": [{"order": i, "text": "шаг"} for i in range(101)]},
    ):
        assert anna.request("POST", "/api/recipes/", json=payload).status_code == 422


def test_pagination_returns_newest_first_and_total(make_user, guest):
    anna = make_user("anna")
    ids = [create_recipe(anna, title=f"Рецепт {i}")["id"] for i in range(5)]

    first = guest.get("/api/recipes/?limit=2").json()
    second = guest.get("/api/recipes/?limit=2&skip=2").json()

    assert first["total"] == 5
    assert [r["id"] for r in first["items"]] == [ids[4], ids[3]]
    assert [r["id"] for r in second["items"]] == [ids[2], ids[1]]


def test_limit_is_bounded(guest):
    assert guest.get("/api/recipes/?limit=101").status_code == 422


def test_search_by_ingredient_ignores_case(make_user, guest):
    anna = make_user("anna")
    pilaf = create_recipe(anna)
    create_recipe(anna, title="Чай", ingredients=[{"name": "Чай", "amount": "1"}])

    result = guest.get("/api/recipes/", params={"ingredient": "МОРКОВ"}).json()

    assert result["total"] == 1
    assert result["items"][0]["id"] == pilaf["id"]


def test_search_treats_wildcards_as_text(make_user, guest):
    create_recipe(make_user("anna"))
    assert guest.get("/api/recipes/", params={"ingredient": "%"}).json()["total"] == 0
    assert guest.get("/api/recipes/", params={"ingredient": "_"}).json()["total"] == 0


def test_filter_by_author(make_user, guest):
    anna, boris = make_user("anna"), make_user("boris")
    recipe = create_recipe(anna)
    create_recipe(boris)
    result = guest.get("/api/recipes/", params={"author_id": anna.id}).json()
    assert [r["id"] for r in result["items"]] == [recipe["id"]]


def test_used_ingredient_cannot_be_deleted(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    ingredient_id = recipe["ingredients"][0]["ingredient_id"]
    assert anna.request("DELETE", f"/api/ingredients/{ingredient_id}").status_code == 409

    anna.request("DELETE", f"/api/recipes/{recipe['id']}")
    assert anna.request("DELETE", f"/api/ingredients/{ingredient_id}").status_code == 204


def test_ingredient_crud_requires_auth(guest):
    assert guest.post("/api/ingredients/", json={"name": "Соль"}).status_code == 401
    assert guest.delete("/api/ingredients/1").status_code == 401
