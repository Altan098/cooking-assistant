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

Добавление, редактирование и удаление своего рецепта.

Поиск рецептов по ингредиентам.

Ведение списка покупок.

Планирование меню на неделю.

Вход и регистрация пользователя.

Экраны

/ — Главная страница
/recipes — Каталог рецептов
/recipes/:id — Детали рецепта
/recipes/new — Добавление рецепта (нужен вход)
/recipes/:id/edit — Редактирование рецепта (только автор)
/search — Поиск по ингредиентам
/shopping-list — Список покупок (нужен вход)
/meal-plan — Планировщик меню (нужен вход)
/profile — Профиль и свои рецепты (нужен вход)
/login — Вход
/register — Регистрация

Модель данных (backend)

User: id, email, username, hashed_password, created_at. Связи: 1→N Recipe.
Recipe: id, title, description, image_url, cooking_time, servings, author_id, created_at. Связи: N→1 User, 1→N RecipeIngredient, 1→N Step.
Ingredient: id, name. Связи: 1→N RecipeIngredient.
RecipeIngredient: id, recipe_id, ingredient_id, amount. Связи: N→1 Recipe, N→1 Ingredient.
Step: id, recipe_id, order, text. Связи: N→1 Recipe.
RefreshToken: id, user_id, token_hash, expires_at, revoked_at, created_at. Связи: N→1 User.
ShoppingItem: id, user_id, name, done, created_at. Связи: N→1 User.
MealPlanEntry: id, user_id, day, meal, recipe_id. Одна запись на день и приём пищи. Связи: N→1 User, N→1 Recipe.

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
PyJWT (access token)
argon2-cffi (хеширование паролей)

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
security.py — хеширование паролей, JWT, refresh token
dependencies.py — получение текущего пользователя
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
features/ — пользовательские действия: auth (вход, регистрация, выход, защита маршрутов), recipe-form (форма создания и редактирования рецепта с валидацией), recipe-delete (удаление с подтверждением), recipe-search (форма поиска), shopping-list (список покупок), meal-plan (меню на неделю).
entities/ — сущности предметной области: recipe (типы, запросы к API, карточка), user (типы).
shared/ — общие утилиты и UI: api (HTTP-клиент с автообновлением токена), lib (useRequest — загрузка данных), ui (Layout, Navbar, DataState — состояния загрузки, ошибки и отсутствия данных).

Направление зависимостей: app → pages → features → entities → shared.

Запуск frontend

Требуется Node.js 20+ и npm.

cd frontend
npm install
npm run dev

Приложение откроется на http://localhost:5173. Запросы к /api Vite проксирует на backend (http://127.0.0.1:8000), поэтому backend должен быть запущен.

Сборка production-версии:

cd frontend
npm run build
npm run preview

Запуск backend

Требования: Python 3.11+, PostgreSQL 15+.

Подготовка БД: создайте пользователя и базу в PostgreSQL.

CREATE USER cook WITH PASSWORD 'cookpass';
CREATE DATABASE cooking_assistant OWNER cook;

Настройка окружения: в папке backend создайте файл .env (образец — .env.example) со строкой подключения, секретом для подписи JWT (минимум 32 символа) и паролем демо-пользователя:

DATABASE_URL=postgresql://cook:cookpass@localhost:5432/cooking_assistant
JWT_SECRET_KEY=<случайная строка>
SEED_USER_PASSWORD=<пароль демо-пользователя>

Сгенерировать секрет:

python -c "import secrets; print(secrets.token_urlsafe(48))"

Установка зависимостей:

cd backend
python -m venv .venv
..venv\Scripts\Activate.ps1
pip install -r requirements.txt

Создание таблиц (команда добавляет и новые таблицы, существующие не меняет):

python -c "from app.database import Base, engine; import app.models; Base.metadata.create_all(engine)"

Наполнение демонстрационными рецептами (повторный запуск не создаёт дублей):

python -m app.seed

Команда создаёт пользователя demo@example.com с паролем из SEED_USER_PASSWORD и 8 рецептов.

Запуск сервера:

uvicorn app.main:app --reload

API доступно на http://127.0.0.1:8000, документация Swagger — http://127.0.0.1:8000/docs.

Аутентификация и авторизация

Пароли хранятся в БД в виде хешей Argon2id.
Access token — JWT (HS256), живёт 15 минут, передаётся в заголовке Authorization: Bearer. На клиенте хранится только в памяти.
Refresh token — случайная строка, живёт 30 дней, передаётся в cookie с флагами HttpOnly и SameSite=Lax. В таблице refresh_tokens лежит только его SHA-256.
При обновлении работает ротация: старый refresh token отзывается и выдаётся новый. Некорректный, истёкший или отозванный токен получает ответ 401.
Если запрос вернул 401, клиент сам обновляет access token и повторяет запрос. Если обновить не удалось, пользователь считается вышедшим.
При выходе refresh token текущей сессии отзывается, cookie удаляется, состояние на клиенте очищается. Уже выданный access token действует до конца своего срока (не более 15 минут).

Сроки действия настраиваются через ACCESS_TOKEN_EXPIRE_MINUTES и REFRESH_TOKEN_EXPIRE_DAYS. На сервере с HTTPS нужно включить REFRESH_COOKIE_SECURE=true.

API

Все маршруты, кроме GET /, начинаются с /api. Замок 🔒 означает, что нужен access token.

GET / — проверка работы сервера
POST /api/auth/register — регистрация и вход
POST /api/auth/login — вход
POST /api/auth/refresh — обновить access token по cookie
POST /api/auth/logout — выход
GET /api/auth/me 🔒 — текущий пользователь
GET /api/users/{id} 🔒 — свой профиль (чужой — 403)
DELETE /api/users/{id} 🔒 — удалить свой аккаунт (чужой — 403)
GET /api/ingredients/ — список ингредиентов
POST /api/ingredients/ 🔒 — создать ингредиент
GET /api/ingredients/{id} — получить ингредиент
DELETE /api/ingredients/{id} 🔒 — удалить ингредиент, если он не используется в рецептах
GET /api/recipes/ — список рецептов; параметры ingredient (поиск по ингредиенту), author_id, skip, limit
POST /api/recipes/ 🔒 — создать рецепт (автор — текущий пользователь, новые ингредиенты добавляются в справочник)
GET /api/recipes/{id} — получить рецепт
PATCH /api/recipes/{id} 🔒 — обновить свой рецепт, включая ингредиенты и шаги (чужой — 403)
DELETE /api/recipes/{id} 🔒 — удалить свой рецепт (чужой — 403)
GET /api/shopping-list/ 🔒 — свой список покупок
POST /api/shopping-list/ 🔒 — добавить продукт
PATCH /api/shopping-list/{id} 🔒 — отметить продукт (чужой — 404)
DELETE /api/shopping-list/{id} 🔒 — удалить продукт (чужой — 404)
GET /api/meal-plan/ 🔒 — своё меню на неделю
PUT /api/meal-plan/{day}/{meal} 🔒 — выбрать блюдо (day: 0–6, meal: breakfast, lunch, dinner)
DELETE /api/meal-plan/{day}/{meal} 🔒 — убрать блюдо

Чтобы вызвать защищённый маршрут в Swagger, получите access_token через /api/auth/login и вставьте его в окно Authorize.

Скриншоты

Скриншоты экранов и API находятся в docs/screenshots/. Итоговое состояние приложения показывают файлы lr5-*.png: каталог, рецепт, форма, поиск, покупки, меню, профиль и состояние ошибки.

История изменений интерфейса

ЛР №1. Создан каркас frontend на React + TypeScript. Реализованы основные экраны с демонстрационными данными: главная, каталог рецептов, детали рецепта, добавление рецепта, поиск по ингредиентам, список покупок, планировщик меню, профиль, вход, регистрация. Настроена клиентская маршрутизация и единое оформление через MUI.
Изменена цветовая схема на серую (палитра MUI настроена в src/app/App.tsx).
На страницу деталей рецепта добавлено изображение блюда.
ЛР №2. Реализован backend на FastAPI: модели SQLAlchemy, Pydantic-схемы валидации, CRUD-операции, маршруты API. Подключён PostgreSQL. Документация доступна через Swagger UI.
ЛР №3. Frontend реорганизован по принципам FSD: логика вынесена в features/, сущности — в entities/, общие компоненты — в shared/. Формы получили клиентскую валидацию, состояния загрузки/успеха/ошибки, анимации появления сообщений (Collapse).
ЛР №4. Реализованы регистрация и вход с хешированием паролей Argon2id, выдача JWT access token и refresh token в HttpOnly-cookie, обновление токена с ротацией, выход с отзывом refresh token. API разделено на публичные и приватные маршруты, изменять рецепт может только автор. На frontend добавлены формы входа и регистрации с валидацией, автообновление токена, защищённые маршруты и выход.
ЛР №5. Основные экраны подключены к API, демонстрационные данные заменены данными из PostgreSQL и перенесены в команду python -m app.seed. Через интерфейс доступны просмотр, создание, редактирование и удаление рецептов с учётом прав автора, поиск на сервере, личный список покупок и меню на неделю. Состояния загрузки, ошибки и отсутствия данных работают с реальными запросами, отказы в доступе показываются понятными сообщениями. Приложение проверено целиком, обновлены README и скриншоты.
