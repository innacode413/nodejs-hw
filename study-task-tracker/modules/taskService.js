const { readTasks, saveTasks } = require('./fileStorage');

let tasks = [];
let nextId = 1;

function loadTasks() {
  tasks = readTasks();
  nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
}

function addTask(title) {
  const task = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
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
  }
  return task;
}

function deleteTask(id) {
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    const removed = tasks.splice(index, 1)[0];
    saveTasks(tasks);
    return removed;
  }
  return null;
}

module.exports = { loadTasks, addTask, getTasks, completeTask, deleteTask };
