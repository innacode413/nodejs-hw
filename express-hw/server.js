const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use((req, res, next) => {
  const time = new Date().toLocaleString('uk-UA');
  console.log(`${req.method} ${req.url} — ${time}`);
  next();
});

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Головна сторінка. Код 200 — успіх.');
});

app.get('/about', (req, res) => {
  res.send('Сторінка "Про нас".');
});

app.get('/time', (req, res) => {
  res.send('Поточний час: ' + new Date().toLocaleString('uk-UA'));
});

app.get('/error', (req, res) => {
  res.status(500).send('Помилка сервера. Код 500.');
});

app.get('/user/:id', (req, res) => {
  res.send('Користувач з ID: ' + req.params.id);
});

app.get('/search', (req, res) => {
  const q = req.query.q;
  if (!q) {
    return res.status(400).send('Не вказано пошуковий запит');
  }
  res.send('Ви шукали: ' + q);
});

app.get('/user/:id/orders', (req, res) => {
  const status = req.query.status || 'unknown';
  res.send('Замовлення користувача ' + req.params.id + ' зі статусом: ' + status);
});

app.post('/feedback', (req, res) => {
  const { name, message } = req.body;
  if (!name) {
    return res.status(400).send('Поле name є обов\'язковим');
  }
  res.send(`Дякуємо, ${name}! Ваш відгук отримано.`);
});

app.get('/crash', (req, res) => {
  throw new Error('Тестова помилка');
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    name: 'Інна',
    role: 'Студент курсу Node.js',
    hobbies: ['читання', 'подорожі', 'програмування', 'кава'],
    isOnline: true
  });
});

app.get('/students', (req, res) => {
  const students = [
    { name: 'Оля', level: 'junior' },
    { name: 'Максим', level: 'middle' },
    { name: 'Ірина', level: 'senior' }
  ];
  res.render('students', { students });
});

app.use((req, res) => {
  res.status(404).render('not-found', { url: req.url });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Щось пішло не так!');
});

app.listen(3000, () => {
  console.log('Express-сервер запущено: http://localhost:3000');
});
