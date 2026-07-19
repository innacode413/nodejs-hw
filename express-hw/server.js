const express = require('express');
const app = express();

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

app.use((req, res) => {
  res.status(404).send('Сторінку не знайдено. Код 404.');
});

app.listen(3000, () => {
  console.log('Express-сервер запущено: http://localhost:3000');
});
