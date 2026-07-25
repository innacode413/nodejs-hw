# Запити до MongoDB — Агрегації, індекси, помилки

## Завдання 1: Aggregation Pipeline

### 1.1 Кількість товарів у кожній категорії

```js
db.products.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
])
```

```
{ "_id": "electronics", "count": 4 }
{ "_id": "books", "count": 2 }
{ "_id": "clothing", "count": 2 }
{ "_id": "food", "count": 2 }
```

### 1.2 Середня ціна товарів по кожній категорії

```js
db.products.aggregate([
  { $group: { _id: "$category", avgPrice: { $avg: "$price" } } }
])
```

```
{ "_id": "electronics", "avgPrice": 625.75 }
{ "_id": "books", "avgPrice": 40 }
{ "_id": "clothing", "avgPrice": 45 }
{ "_id": "food", "avgPrice": 24 }
```

### 1.3 Сумарна вартість складу (price * stock)

```js
db.products.aggregate([
  { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$stock"] } } } }
])
```

```
{ "_id": null, "totalValue": 18230 }
```

### 1.4 Категорії з середньою ціною більше 300

```js
db.products.aggregate([
  { $group: { _id: "$category", avgPrice: { $avg: "$price" } } },
  { $match: { avgPrice: { $gt: 300 } } }
])
```

```
{ "_id": "electronics", "avgPrice": 625.75 }
```

### 1.5 Кількість активних та неактивних користувачів

```js
db.users.aggregate([
  { $group: { _id: "$isActive", count: { $sum: 1 } } }
])
```

```
{ "_id": true, "count": 3 }
{ "_id": false, "count": 2 }
```

---

## Завдання 2: Індекси та швидкість запитів

### COLLSCAN vs IXSCAN

COLLSCAN (Collection Scan) — MongoDB переглядає **всі** документи колекції, щоб знайти відповідні. Це повільно при великому обсязі даних, бо кожен документ перевіряється.

IXSCAN (Index Scan) — MongoDB використовує **індекс** (деревоподібну структуру) для пошуку потрібних документів. Він спочатку знаходить посилання на документи в індексі, а потім звертається тільки до них. Це набагато швидше, бо переглядається значно менше документів.

### Існуючі індекси

```js
db.users.getIndexes()
```

```
[
  { "v": 2, "key": { "_id": 1 }, "name": "_id_" },
  { "v": 2, "key": { "email": 1 }, "name": "email_1", "unique": true }
]
```

Індекс `email_1` з'явився автоматично, тому що в моделі `userModel.js` поле `email` має властивість `unique: true`. Mongoose створює унікальний індекс для кожного поля з `unique`.

### Порівняня explain() до та після індексу

**До створення індексу** (COLLSCAN):

```js
db.products.find({ category: "electronics" }).explain("executionStats")
```

```
"executionStats": {
  "executionSuccess": true,
  "totalDocsExamined": 10,
  "totalKeysExamined": 0,
  "executionStages": { "stage": "COLLSCAN", ... }
}
```

```js
db.products.createIndex({ category: 1 })
```

**Після створення індексу** (IXSCAN):

```js
db.products.find({ category: "electronics" }).explain("executionStats")
```

```
"executionStats": {
  "executionSuccess": true,
  "totalDocsExamined": 4,
  "totalKeysExamined": 4,
  "executionStages": { "stage": "IXSCAN", ... }
}
```

### Помилка дублікату email

```js
db.users.insertOne({ name: "Test", email: "olena@example.com", age: 25, city: "Kyiv", isActive: true })
```

```
WriteError({
  "code": 11000,
  "errmsg": "E11000 duplicate key error collection: shopDB.users index: email_1 dup key: { email: \"olena@example.com\" }"
})
```

Ця помилка виникла, тому що поле `email` має унікальний індекс (`unique: true` у схемі). MongoDB не дозволяє два документи з однаковим значенням цього поля.

### Висновок

Після створення індексу на `category` кількість переглянутих документів (`totalDocsExamined`) зменшилася з 10 (всі товари) до 4 (тільки товари з потрібною категорією). Це тому, що індекс дозволяє MongoDB відразу знайти потрібні документи, не скануючи всю колекцію.

---

## Завдання 3: Обробка помилок

### 3.1 Невалідний ObjectId

```
GET /api/products/123abc
```

```json
{
  "error": "Невалідний ID: 123abc"
}
```

Статус: **400 Bad Request**

Mongoose кидає помилку `CastError`, коли отримує рядок, який не є валідним 24-символьним hex ObjectId. Наш error handler перехоплює цю помилку і повертає 400.

### 3.2 Невалідна категорія (enum)

```
POST /api/products
{ "name": "Lego Set", "price": 50, "category": "toys", "stock": 10 }
```

```json
{
  "error": "Помилка валідації",
  "fields": {
    "category": "toys is not a valid enum value for path `category`"
  }
}
```

Статус: **400 Bad Request**

### 3.3 Неіснуючий маршрут

```
GET /api/nonexistent
```

```json
{
  "error": "Маршрут GET /api/nonexistent не знайдено"
}
```

Статус: **404 Not Found**

### 3.4 Дублікат email

```
POST /api/users
{ "name": "Test", "email": "olena@example.com", "age": 25, "city": "Kyiv", "isActive": true }
```

```json
{
  "error": "Значення 'olena@example.com' для поля 'email' вже існує"
}
```

Статус: **400 Bad Request**

### 3.5 Відсутнє обов'язкове поле

```
POST /api/products
{ "price": 100 }
```

```json
{
  "error": "Помилка валідації",
  "fields": {
    "name": "Path `name` is required.",
    "category": "Path `category` is required."
  }
}
```

Статус: **400 Bad Request**

---

## Кешування

Кеш працює протягом 30 секунд. Перший запит `GET /api/products` завантажує дані з MongoDB та зберігає їх у змінній з міткою часу. Наступні запити протягом 30 секунд повертають кешовані дані. Після закінчення часу кеш стає неактуальним, і дані знову беруться з бази.

```bash
curl http://localhost:5000/api/products
# Консоль: [db] Завантаження з MongoDB

curl http://localhost:50000/api/products
# Консоль: [cache] Повернення з кешу
```

**Що станеться з кешем при створенні товару?** Після `POST /api/products` кеш скидається (`cache = null`), тому наступний GET запит завантажить актуальні дані з бази. Без цього новий товар не з'явився б у списку до закінчення 30 секунд.
