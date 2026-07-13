const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, '..', 'data', 'events.log');

class EventLogger extends EventEmitter {
  log(event, message) {
    const line = `${new Date().toISOString()} | ${event} | ${message}\n`;
    fs.appendFileSync(logPath, line, 'utf-8');
  }
}

const logger = new EventLogger();

logger.on('taskCreated', (task) => {
  logger.log('taskCreated', `Task "${task.title}" was created`);
});

logger.on('taskCompleted', (task) => {
  logger.log('taskCompleted', `Task "${task.title}" was completed`);
});

logger.on('taskDeleted', (task) => {
  logger.log('taskDeleted', `Task "${task.title}" was deleted`);
});

logger.on('appStarted', () => {
  logger.log('appStarted', 'Application started');
});

module.exports = logger;
