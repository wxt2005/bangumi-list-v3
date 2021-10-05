import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model';

const authAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.sendStatus(401);
    return;
  }

  if (req.user.role !== UserRole.ADMIN) {
    res.sendStatus(401);
    return;
  }

  next();
};

export default authAdmin;
