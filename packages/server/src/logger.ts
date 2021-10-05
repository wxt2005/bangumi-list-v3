import path from 'path';
import pino from 'pino';
import { LOG_DIR, LOG_FILE } from './config';

export function createLogger(): pino.Logger {
  const TIME_FORMAT = 'SYS:yyyy-mm-dd HH:MM:ss o';

  if (process.env.NODE_ENV === 'production') {
    return pino(
      {
        prettyPrint: {
          translateTime: TIME_FORMAT,
        },
      },
      pino.destination(path.resolve(LOG_DIR, LOG_FILE))
    );
  }

  return pino({
    prettyPrint: {
      translateTime: TIME_FORMAT,
      colorize: true,
      ignore: 'hostname,pid',
    },
  });
}

export default createLogger();
