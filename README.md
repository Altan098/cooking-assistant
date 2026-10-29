Ассистент повара

Full-stack приложение для подбора рецептов, планирования меню и ведения списка покупок. Проект выполняется в рамках курса Fullstack, лабораторные работы №1–5.

Тема и назначение

Приложение помогает пользователю:
хранить личную коллекцию рецептов;
искать блюда по имеющимся ингредиентам;
формировать список покупок;
планировать меню на неделю.

Пользовательские сценарии

Просмотр каталога рецептов.

Просмотр деталей рецепта.

Добавление нового рецепта.

Поиск рецептов по ингредиентам.

Ведение списка покупок.

Планирование меню на неделю.

Вход и регистрация пользователя.

Экраны

/ — Главная страница
/recipes — Каталог рецептов
/recipes/:id — Детали рецепта
/recipes/new — Добавление рецепта
/search — Поиск по ингредиентам
/shopping-list — Список покупок
/meal-plan — Планировщик меню
/profile — Профиль пользователя
/login — Вход
/register — Регистрация

Модель данных (backend)

User: id, email, username, hashed_password, created_at. Связи: 1→N Recipe.
Recipe: id, title, description, image_url, cooking_time, servings, author_id, created_at. Связи: N→1 User, 1→N RecipeIngredient, 1→N Step.
Ingredient: id, name. Связи: 1→N RecipeIngredient.
RecipeIngredient: id, recipe_id, ingredient_id, amount. Связи: N→1 Recipe, N→1 Ingredient.
Step: id, recipe_id, order, text. Связи: N→1 Recipe.

Схема связей:
User 1—N Recipe 1—N RecipeIngredient N—1 Ingredient
Recipe 1—N Step

Стек

Frontend:
React 19 + TypeScript
Vite 8
Material UI (MUI) 9
React Router 7

Backend:
Python 3.12
FastAPI 0.143
SQLAlchemy 2.1
PostgreSQL 18
Pydantic 2
psycopg 3
Uvicorn

Инструменты:
Git + GitHub

Структура проекта

cooking-assistant/
backend/
app/
models/ — модели SQLAlchemy
schemas/ — Pydantic-схемы валидации
crud/ — операции с БД
routers/ — маршруты API
config.py — настройки из .env
database.py — engine, SessionLocal, Base
main.py — точка входа FastAPI
.env — секреты (в .gitignore)
.env.example — пример без секретов
requirements.txt
frontend/
src/
app/ — настройка приложения, роутер, тема
pages/ — страницы
features/ — пользовательские действия
entities/ — сущности предметной области
shared/ — общие компоненты и утилиты
package.json
docs/
screenshots/ — скриншоты экранов и API
.gitignore
README.md

Архитектура frontend (упрощённый FSD)

Код организован по методологии Feature-Sliced Design (упрощённо):

app/ — настройка приложения: App, router, тема MUI.
pages/ — страницы (по одной на маршрут).
features/ — пользовательские действия: recipe-form (форма создания рецепта с валидацией), recipe-search (форма поиска), shopping-list (список покупок).
entities/ — сущности предметной области: recipe (типы, моковые данные, карточка), ingredient, user.
shared/ — общие утилиты и UI: ui (Layout, Navbar), lib (валидация).

Направление зависимостей: app → pages → features → entities → shared.

Запуск frontend

Требуется Node.js 20+ и npm.

cd frontend
npm install
npm run dev

Приложение откроется на http://localhost:5173.

Сборка production-версии:

cd frontend
npm run build
npm run preview

Запуск backend

Требования: Python 3.11+, PostgreSQL 15+.

Подготовка БД: создайте пользователя и базу в PostgreSQL.

CREATE USER cook WITH PASSWORD 'cookpass';
CREATE DATABASE cooking_assistant OWNER cook;

Настройка окружения: в папке backend создайте файл .env (образец — .env.example) со строкой подключения:

DATABASE_URL=postgresql://cook:cookpass@localhost:5432/cooking_assistant

Установка зависимостей:

cd backend
python -m venv .venv
..venv\Scripts\Activate.ps1
pip install -r requirements.txt

Создание таблиц:

python -c "from app.database import Base, engine; import app.models; Base.metadata.create_all(engine)"

Запуск сервера:

uvicorn app.main:app --reload

API доступно на http://127.0.0.1:8000, документация Swagger — http://127.0.0.1:8000/docs.

API

GET / — проверка работы сервера
GET /users/ — список пользователей
POST /users/ — создать пользователя
GET /users/{id} — получить пользователя
DELETE /users/{id} — удалить пользователя
GET /ingredients/ — список ингредиентов
POST /ingredients/ — создать ингредиент
GET /ingredients/{id} — получить ингредиент
DELETE /ingredients/{id} — удалить ингредиент
GET /recipes/ — список рецептов
POST /recipes/ — создать рецепт
GET /recipes/{id} — получить рецепт
PATCH /recipes/{id} — обновить рецепт
DELETE /recipes/{id} — удалить рецепт

Скриншоты

Скриншоты экранов и API находятся в docs/screenshots/.

История изменений интерфейса

ЛР №1. Создан каркас frontend на React + TypeScript. Реализованы основные экраны с демонстрационными данными: главная, каталог рецептов, детали рецепта, добавление рецепта, поиск по ингредиентам, список покупок, планировщик меню, профиль, вход, регистрация. Настроена клиентская маршрутизация и единое оформление через MUI.
Изменена цветовая схема на серую (палитра MUI настроена в src/app/App.tsx).
На страницу деталей рецепта добавлено изображение блюда.
ЛР №2. Реализован backend на FastAPI: модели SQLAlchemy, Pydantic-схемы валидации, CRUD-операции, маршруты API. Подключён PostgreSQL. Документация доступна через Swagger UI.
ЛР №3. Frontend реорганизован по принципам FSD: логика вынесена в features/, сущности — в entities/, общие компоненты — в shared/. Формы получили клиентскую валидацию, состояния загрузки/успеха/ошибки, анимации появления сообщений (Collapse).