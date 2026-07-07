const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

console.log('WebSocket-сервер запущено: ws://localhost:8080');

wss.on('connection', (socket) => {
  console.log('Новий клієнт підключився');

  socket.on('message', (data) => {
    const text = data.toString();
    const time = new Date().toLocaleTimeString('uk-UA');
    const message = `[${time}] ${text}`;
    console.log('Отримано:', message);

    wss.clients.forEach((client) => {
      client.send(message);
    });
  });

  socket.on('close', () => {
    console.log('Клієнт відключився');
  });
});
