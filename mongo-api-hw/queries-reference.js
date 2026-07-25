// === Завдання 3: Запити на пошук ===

// 1. Всі товари категорії electronics
db.products.find({ "category": "electronics" })

// 2. Товари з price > 500
db.products.find({ "price": { "$gt": 500 } })

// 3. Товари, яких немає в наявності (stock: 0)
db.products.find({ "stock": 0 })

// 4. Товари з ціною від 100 до 1000
db.products.find({ "price": { "$gte": 100, "$lte": 1000 } })

// 5. Активні користувачі
db.users.find({ "isActive": true })

// 6. Користувачі старші за 25
db.users.find({ "age": { "$gt": 25 } })

// === Завдання 4: Сортування та обмеження ===

// 7. Товари від дорогих до дешевих
db.products.find().sort({ "price": -1 })

// 8. 3 найдешевші товари
db.products.find().sort({ "price": 1 }).limit(3)

// 9. Користувачі за age за зростанням
db.users.find().sort({ "age": 1 })

// === Додаткове ===

// 10. Electronics, price < 1000, stock > 0
db.products.find({
  "category": "electronics",
  "price": { "$lt": 1000 },
  "stock": { "$gt": 0 }
})
