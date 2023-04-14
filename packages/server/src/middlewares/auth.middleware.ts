import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import tokenModel from '../models/token.model';
import { RequestUser } from '../types';
import logger from '../logger';

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization as string;

  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const match = /^Bearer\s(.+)$/.exec(authHeader);
  if (!match) {
    res.sendStatus(401);
    return;
  }

  const token = match[1];
  let user: RequestUser;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    user = {
      id: decoded.userID,
      role: decoded.userRole,
      token,
    };
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      const decoded = jwt.decode(token) as JwtPayload;
      try {
        await tokenModel.remove(decoded.userID, token);
      } catch (error) {
        logger.error(error || {}, 'Remove token failed');
      }
    }
    console.error(error);
    res.sendStatus(401);
    return;
  }

  const isValid = await tokenModel.validate(user.id, token);
  if (!isValid) {
    res.sendStatus(401);
    return;
  }

  req.user = user;
  next();
};

export default auth;
