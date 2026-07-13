const { initStorage, readTasks } = require('./modules/fileStorage');
const { loadTasks, addTask, getTasks, completeTask, deleteTask } = require('./modules/taskService');
const { formatTasks } = require('./modules/taskFormatter');
const { printSystemInfo } = require('./modules/systemInfo');
const logger = require('./modules/eventLogger');

initStorage();
loadTasks();
logger.emit('appStarted');

const t1 = addTask('Learn Node.js events');
console.log('Додано:', t1.title);

const t2 = addTask('Practice crypto module');
console.log('Додано:', t2.title);

const t3 = addTask('Build a logger');
console.log('Додано:', t3.title);

console.log('\n--- Всі задачі ---');
console.log(formatTasks(getTasks()));

completeTask(2);
console.log('\n--- Після виконання задачі #2 ---');
console.log(formatTasks(getTasks()));

deleteTask(1);
console.log('\n--- Після видалення задачі #1 ---');
console.log(formatTasks(getTasks()));

console.log('\n--- Перечитування з файлу ---');
const fromFile = readTasks();
console.log(formatTasks(fromFile));

printSystemInfo();
