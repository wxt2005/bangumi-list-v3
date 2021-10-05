import express from 'express';
import apiV1Routes from './routes/v1';
import bangumiModel from './models/bangumi.model';
import userModel from './models/user.model';
import tokenModel from './models/token.model';
import userPreferenceModel from './models/userPreference.model';
import bangumiPreferenceModel from './models/bangumiPreference.model';
import db from './db';
import fse from 'fs-extra';
import pinoHttp from 'pino-http';
import logger from './logger';
import {
  PORT,
  RUNTIME_DIR,
  LOG_DIR,
  CLIENT_DIST_DIR,
  CLIENT_INDEX_HTML,
} from './config';
import './types';

(async function main() {
  await fse.ensureDir(RUNTIME_DIR);
  await fse.ensureDir(LOG_DIR);

  await db.init();
  await userModel.initDB();
  await tokenModel.initDB();
  await userPreferenceModel.initDB();
  await bangumiPreferenceModel.initDB();
  await bangumiModel.update(false);
  await userModel.createAdminIfNotExist();

  const app = express();

  app.use(pinoHttp({ logger }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/v1', apiV1Routes);
  app.use(express.static(CLIENT_DIST_DIR));
  app.get('/*', function (req, res) {
    res.sendFile(CLIENT_INDEX_HTML);
  });
  app.listen(PORT);

  logger.info('Server running on port %d', PORT);
})();
