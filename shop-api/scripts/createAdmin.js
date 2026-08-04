require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');

async function createAdmin() {
  const [email, password] = process.argv.slice(2);
  const adminEmail = email || process.env.ADMIN_EMAIL;
  const adminPassword = password || process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('Використання: node scripts/createAdmin.js <email> <password>');
    process.exit(1);
  }
  if (adminPassword.length < 8) {
    console.error('Пароль має містити щонайменше 8 символів');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    console.error('Адміністратор з таким email вже існує');
    process.exit(1);
  }

  const hashed = await bcrypt.hash(adminPassword, 10);
  const admin = await User.create({
    email: adminEmail.toLowerCase(),
    password: hashed,
    name: 'Administrator',
    role: 'admin',
  });

  console.log('Адміністратора створено:', admin.email);
  await mongoose.disconnect();
}

createAdmin().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
