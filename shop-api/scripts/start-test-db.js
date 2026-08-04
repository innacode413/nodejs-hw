const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { port: 27017, dbName: 'shopDB' },
  });
  console.log('Test MongoDB on', mongod.getUri());
  process.on('SIGTERM', async () => { await mongod.stop(); process.exit(0); });
})();
