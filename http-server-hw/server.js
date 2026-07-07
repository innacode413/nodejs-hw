const http = require('http');

const server = http.createServer((req, res) => {
  // req — вхідний запит (метод, URL, заголовки)
  // res — відповідь, яку ми формуємо

  console.log(`Отримано запит: ${req.method} ${req.url}`);

  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Головна сторінка. Код 200 — успіх.');

  } else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Сторінка "Про нас".');

  } else if (req.url === '/error') {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Помилка сервера. Код 500.');

  } else if (req.url === '/time') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Поточний час: ' + new Date().toLocaleString('uk-UA'));

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Сторінку не знайдено. Код 404.');
  }
});

server.listen(3000, () => {
  console.log('Сервер запущено: http://localhost:3000');
});
