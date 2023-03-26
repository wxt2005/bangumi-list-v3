import express from 'express';
import apiV1Routes from './routes/v1';
import bangumiModel from './models/bangumi.model';
import fse from 'fs-extra';
import pinoHttp from 'pino-http';
import logger from './logger';
import { PORT, HOST, RUNTIME_DIR, LOG_DIR } from './config';
import './types';

(async function main() {
  await fse.ensureDir(RUNTIME_DIR);
  await fse.ensureDir(LOG_DIR);

  await bangumiModel.update(false);

  const app = express();
  app.use(pinoHttp({ logger }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1', apiV1Routes);
  app.listen(PORT, HOST);

  logger.info('Server running on host %s, port %d', HOST, PORT);
})();
