const os = require('os');

function printSystemInfo() {
  console.log('\n--- Системна інформація ---');
  console.log(`ОС: ${os.type()} ${os.release()}`);
  console.log(`Вільна пам'ять: ${(os.freemem() / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Час роботи системи: ${(os.uptime() / 3600).toFixed(1)} год`);
  console.log(`Кількість CPU: ${os.cpus().length}`);
}

module.exports = { printSystemInfo };
