const crypto = require('crypto');
const { readTasks, saveTasks } = require('./fileStorage');
const logger = require('./eventLogger');

let tasks = [];
let nextId = 1;

function loadTasks() {
  tasks = readTasks();
  nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}

function createHash(id, title, createdAt) {
  return crypto.createHash('sha256').update(`${id}-${title}-${createdAt}`).digest('hex');
}

function addTask(title) {
  const now = new Date().toISOString();
  const id = nextId++;
  const task = {
    id,
    title,
    completed: false,
    createdAt: now,
    hash: createHash(id, title, now),
  };
  tasks.push(task);
  saveTasks(tasks);
  logger.emit('taskCreated', task);
  return task;
}

function getTasks() {
  return tasks;
}

function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = true;
    saveTasks(tasks);
    logger.emit('taskCompleted', task);
  }
  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    const removed = tasks.splice(index, 1)[0];
    saveTasks(tasks);
    logger.emit('taskDeleted', removed);
    return removed;
  }
  return null;
}

module.exports = { loadTasks, addTask, getTasks, completeTask, deleteTask };
