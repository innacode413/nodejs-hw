function formatTask(task) {
  const status = task.completed ? 'completed' : 'in progress';
  return `[${task.id}] ${task.title} — ${status}`;
}

function formatTasks(tasks) {
  return tasks.map(formatTask).join('\n');
}

module.exports = { formatTask, formatTasks };
