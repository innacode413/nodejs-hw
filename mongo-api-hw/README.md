# MongoDB CRUD API

REST API для роботи з товарами та користувачами. Побудований на Express + Mongoose.

## Встановлення

```bash
git clone <repo-url>
cd mongo-api-hw
npm install
```

## Налаштування

1. Скопіюйте `.env.example` у `.env`:

```bash
cp .env.example .env
```

2. Відредагуйте `.env` — вкажіть URI підключення до MongoDB:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopDB
```

## Запуск

```bash
node seed.js     # наповнити базу тестовими даними (опціонально)
node server.js   # запустити сервер
```

Сервер запускається на `http://localhost:5000`.

## API endpoints

### Товари

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/api/products` | Всі товари (кеш 30с) |
| GET | `/api/products/:id` | Один товар |
| POST | `/api/products` | Створити товар |
| PUT | `/api/products/:id` | Оновити товар |
| DELETE | `/api/products/:id` | Видалити товар |

### Користувачі

| Метод | Шлях | Опис |
|-------|------|------|
| GET | `/api/users` | Всі користувачі |
| GET | `/api/users/:id` | Один користувач |
| POST | `/api/users` | Створити користувача |
| PUT | `/api/users/:id` | Оновити користувача |
| DELETE | `/api/users/:id` | Видалити користувача |

## Обробка помилок

| Запит | Відповідь |
|-------|-----------|
| `GET /api/products/123abc` | `400` — Невалідний ID |
| `POST /api/products` (без name) | `400` — Помилка валідації зі списком полів |
| `POST /api/products` (category: "toys") | `400` — "toys" не є допустимим значенням enum |
| `POST /api/users` (дублікат email) | `400` — значення вже існує |
| `GET /api/nonexistent` | `404` — Маршрут не знайдено |

## Кешування

`GET /api/products` кешує результат на 30 секунд. При створенні/оновленні/видаленні товару кеш автоматично скидається.
