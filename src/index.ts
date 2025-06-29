import { MongoHelper } from './infrastructure/database/mongo-helper';
import app from './shared/config/app';
import { env } from './shared/config/env';
import { Log } from './shared/logger/log';

async function startServer() {
  try {
    await MongoHelper.connect(String(env.mongo_uri), env.mongo_debug);
    app.listen(env.port, () => Log.info(`server running on port ${env.port}`));
  } catch (error) {
    Log.error('Error starting server: ', error);
    process.exit(1);
  }
}

startServer();
