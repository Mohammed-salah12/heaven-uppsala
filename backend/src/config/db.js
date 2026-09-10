const mongoose = require('mongoose');

let memoryServer = null;

/**
 * Resolve the MongoDB connection string.
 * Priority:
 *   1. USE_MEMORY_DB=true  -> spin up an ephemeral in-memory MongoDB
 *   2. MONGODB_URI         -> use the provided URI (local or Atlas)
 *   3. fallback            -> mongodb://127.0.0.1:27017/heaven
 */
async function resolveUri() {
  if (String(process.env.USE_MEMORY_DB).toLowerCase() === 'true') {
    // Lazy require so production installs don't need this dev dependency loaded.
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri('heaven');
    console.log('🧪  Using in-memory MongoDB (data is not persisted).');
    return uri;
  }
  return process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/heaven';
}

async function connectDB() {
  const uri = await resolveUri();
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  const { host, name } = mongoose.connection;
  console.log(`✅  MongoDB connected: ${host}/${name}`);
  return mongoose.connection;
}

async function disconnectDB() {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
}

module.exports = { connectDB, disconnectDB };
