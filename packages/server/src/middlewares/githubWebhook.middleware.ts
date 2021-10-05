import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import logger from '../logger';

const SIGN_HEADER_NAME = 'X-Hub-Signature-256';
const SIGN_HASH_ALGORITHM = 'sha256';

const githubWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const signHeader = req.get(SIGN_HEADER_NAME);
  const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
  if (!secret) {
    logger.error('Empty secret');
    res.sendStatus(401);
    return;
  }
  if (!signHeader) {
    logger.error('Empty sign header');
    res.sendStatus(401);
    return;
  }

  const sign = Buffer.from(signHeader, 'utf8');
  const hmac = crypto.createHmac(SIGN_HASH_ALGORITHM, secret);
  const digest = Buffer.from(
    SIGN_HASH_ALGORITHM +
      '=' +
      hmac.update(JSON.stringify(req.body)).digest('hex'),
    'utf8'
  );
  if (sign.length !== digest.length || !crypto.timingSafeEqual(digest, sign)) {
    console.error('Mismatch');
    logger.error('Signature mismatch');
    res.sendStatus(401);
    return;
  }

  next();
};

export default githubWebhook;
