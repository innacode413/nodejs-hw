require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const User = require('./models/userModel');

const users = [
  { name: 'Olena', email: 'olena@example.com', age: 28, city: 'Kraków', isActive: true },
  { name: 'Dmytro', email: 'dmytro@example.com', age: 35, city: 'Kyiv', isActive: true },
  { name: 'Natalia', email: 'natalia@example.com', age: 22, city: 'Warsaw', isActive: false },
  { name: 'Andriy', email: 'andriy@example.com', age: 41, city: 'Lviv', isActive: false },
  { name: 'Iryna', email: 'iryna@example.com', age: 30, city: 'Gdańsk', isActive: true },
];

const products = [
  { name: 'iPhone 15', price: 1200, category: 'electronics', stock: 10 },
  { name: 'MacBook Air', price: 999, category: 'electronics', stock: 5 },
  { name: 'AirPods Pro', price: 249, category: 'electronics', stock: 15 },
  { name: 'Node.js Design Patterns', price: 45, category: 'books', stock: 20 },
  { name: 'Eloquent JavaScript', price: 35, category: 'books', stock: 0 },
  { name: 'T-Shirt Node.js', price: 25, category: 'clothing', stock: 30 },
  { name: 'Hoodie JavaScript', price: 65, category: 'clothing', stock: 0 },
  { name: 'Coffee Beans 1kg', price: 18, category: 'food', stock: 50 },
  { name: 'Green Tea Set', price: 30, category: 'food', stock: 12 },
  { name: 'USB-C Hub', price: 55, category: 'electronics', stock: 0 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB підключено');

    await Product.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(products);
    console.log('Додано', products.length, 'товарів');

    await User.insertMany(users);
    console.log('Додано', users.length, 'користувачів');

    await mongoose.disconnect();
    console.log('Готово!');
  } catch (err) {
    console.error('Помилка:', err.message);
    process.exit(1);
  }
}

seed();
