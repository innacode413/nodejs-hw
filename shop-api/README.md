# Shop API — повноцінний бекенд інтернет-магазину

Node.js + Express + MongoDB (Mongoose) REST API з автентифікацією, ролями та замовленнями.

## Функціонал

### Аутентифікація (`/api/auth`)
- `POST /register` — реєстрація. Email нормалізується в lowercase, пароль мінімум 8 символів, хешується bcrypt (10 раундів). Роль завжди `user` — отримати `admin` через реєстрацію неможливо.
- `POST /login` — повертає `accessToken` (JWT, 15 хв) і кладе `refreshToken` у httpOnly cookie (7 днів).
- `GET /me` — дані поточного користувача (потребує Bearer-токен).
- `POST /refresh` — ротація refresh-токена. Старий токен видаляється з БД, видається нова пара. Повторне використання старого токена відхиляється.
- `POST /logout` — видаляє refresh-токен з БД і чистить cookie.

### Товари (`/api/products`)
- `GET /` — публічний список з пагінацією `?page=&limit=` та фільтром `?category=`. Відповідь: `{ products, total, page, limit, totalPages }`.
- `GET /:id` — один товар.
- `POST /`, `PUT /:id`, `DELETE /:id` — тільки для адміністратора.

### Замовлення (`/api/orders`)
- `POST /` — створення замовлення з перевіркою наявності на складі та автоматичним зменшенням `stock`.
- `GET /` — звичайний користувач бачить лише свої замовлення, адмін — усі.
- `GET /:id` — доступ до чужого замовлення заборонений.
- `PATCH /:id/status` — зміна статусу (`pending`, `paid`, `shipped`, `cancelled`), тільки адмін.

## Запуск

```bash
npm install
cp .env.example .env   # вкажіть свої секрети та MONGO_URI
node scripts/createAdmin.js <email> <password>   # створити адміністратора
node server.js
```

Сервер: `http://localhost:5000`.

Без локальної MongoDB можна запустити тестову БД у пам'яті:
```bash
node scripts/start-test-db.js   # MongoDB на 127.0.0.1:27017
```

## Структура

```
config/db.js            # підключення до MongoDB
models/                 # User, Product, Order, RefreshToken
controllers/            # authController, productController, orderController
middlewares/            # authMiddleware, roleMiddleware, errorHandler
routes/                 # authRoutes, productRoutes, orderRoutes
scripts/createAdmin.js  # скрипт створення адміністратора
scripts/start-test-db.js# тестова MongoDB у пам'яті (dev)
server.js               # вхідна точка
```

## Технології
- Express
- Mongoose
- jsonwebtoken (access + refresh)
- bcrypt (паролі)
- cookie-parser (httpOnly refresh-токен)
- dotenv (конфігурація)
