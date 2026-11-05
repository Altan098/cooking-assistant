"""Список покупок и меню приватные: пользователь видит и меняет только свои записи."""


def create_item(user, name="Хлеб"):
    response = user.request("POST", "/api/shopping-list/", json={"name": name})
    assert response.status_code == 201
    return response.json()


def create_recipe(user, title="Суп"):
    return user.request("POST", "/api/recipes/", json={"title": title}).json()


def test_personal_routes_require_auth(guest):
    assert guest.get("/api/shopping-list/").status_code == 401
    assert guest.get("/api/meal-plan/").status_code == 401


def test_shopping_item_lifecycle(make_user):
    anna = make_user("anna")
    item = create_item(anna, " Хлеб ")
    assert item == {"id": item["id"], "name": "Хлеб", "done": False}

    assert anna.request("PATCH", f"/api/shopping-list/{item['id']}", json={"done": True}).json()["done"] is True
    assert anna.request("GET", "/api/shopping-list/").json()[0]["done"] is True

    assert anna.request("DELETE", f"/api/shopping-list/{item['id']}").status_code == 204
    assert anna.request("GET", "/api/shopping-list/").json() == []


def test_empty_shopping_item_is_rejected(make_user):
    assert make_user("anna").request("POST", "/api/shopping-list/", json={"name": "   "}).status_code == 422


def test_foreign_shopping_item_looks_missing(make_user):
    anna, boris = make_user("anna"), make_user("boris")
    item = create_item(anna)
    assert boris.request("GET", "/api/shopping-list/").json() == []
    assert boris.request("PATCH", f"/api/shopping-list/{item['id']}", json={"done": True}).status_code == 404
    assert boris.request("DELETE", f"/api/shopping-list/{item['id']}").status_code == 404


def test_meal_plan_slot_holds_one_recipe(make_user):
    anna = make_user("anna")
    soup, tea = create_recipe(anna, "Суп"), create_recipe(anna, "Чай")

    anna.request("PUT", "/api/meal-plan/0/lunch", json={"recipe_id": soup["id"]})
    response = anna.request("PUT", "/api/meal-plan/0/lunch", json={"recipe_id": tea["id"]})

    assert response.json() == {"day": 0, "meal": "lunch", "recipe": {"id": tea["id"], "title": "Чай"}}
    assert len(anna.request("GET", "/api/meal-plan/").json()) == 1


def test_meal_plan_validates_slot_and_recipe(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    assert anna.request("PUT", "/api/meal-plan/7/lunch", json={"recipe_id": recipe["id"]}).status_code == 422
    assert anna.request("PUT", "/api/meal-plan/0/brunch", json={"recipe_id": recipe["id"]}).status_code == 422
    assert anna.request("PUT", "/api/meal-plan/0/lunch", json={"recipe_id": 999}).status_code == 404


def test_meal_plan_is_private(make_user):
    anna, boris = make_user("anna"), make_user("boris")
    recipe = create_recipe(anna)
    anna.request("PUT", "/api/meal-plan/0/lunch", json={"recipe_id": recipe["id"]})
    assert boris.request("GET", "/api/meal-plan/").json() == []
    assert boris.request("DELETE", "/api/meal-plan/0/lunch").status_code == 404


def test_deleted_recipe_disappears_from_other_meal_plans(make_user):
    anna, boris = make_user("anna"), make_user("boris")
    recipe = create_recipe(anna)
    assert boris.request("PUT", "/api/meal-plan/1/dinner", json={"recipe_id": recipe["id"]}).status_code == 200

    anna.request("DELETE", f"/api/recipes/{recipe['id']}")

    assert boris.request("GET", "/api/meal-plan/").json() == []


def test_clear_meal_plan_slot(make_user):
    anna = make_user("anna")
    recipe = create_recipe(anna)
    anna.request("PUT", "/api/meal-plan/0/lunch", json={"recipe_id": recipe["id"]})
    assert anna.request("DELETE", "/api/meal-plan/0/lunch").status_code == 204
    assert anna.request("DELETE", "/api/meal-plan/0/lunch").status_code == 404


def test_health(guest):
    response = guest.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
