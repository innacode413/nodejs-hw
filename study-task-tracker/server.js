const http = require('http');
const { initStorage } = require('./modules/fileStorage');
const { loadTasks, addTask, getTasks } = require('./modules/taskService');
const logger = require('./modules/eventLogger');

initStorage();
loadTasks();
logger.emit('appStarted');

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // GET /
  if (method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Study Task Tracker API</h1>');
    return;
  }

  // GET /tasks
  if (method === 'GET' && pathname === '/tasks') {
    const status = parsedUrl.searchParams.get('status');
    let tasks = getTasks();

    if (status === 'completed') {
      tasks = tasks.filter(t => t.completed);
    } else if (status === 'active') {
      tasks = tasks.filter(t => !t.completed);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
    return;
  }

  // GET /tasks/:id
  const tasksMatch = pathname.match(/^\/tasks\/(\d+)$/);
  if (method === 'GET' && tasksMatch) {
    const id = Number(tasksMatch[1]);
    const task = getTasks().find(t => t.id === id);

    if (!task) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Task not found' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(task));
    return;
  }

  // POST /tasks
  if (method === 'POST' && pathname === '/tasks') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      const task = addTask(data.title);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(task));
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(3000, () => {
  console.log('HTTP-сервер запущено: http://localhost:3000');
});
