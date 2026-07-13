const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const filePath = path.join(dataDir, 'tasks.json');

function initStorage() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }
}

function readTasks() {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2), 'utf-8');
}

module.exports = { initStorage, readTasks, saveTasks };
