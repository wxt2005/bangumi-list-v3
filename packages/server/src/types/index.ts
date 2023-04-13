import { UserRole } from '../models/user.model';

export interface RequestUser {
  id: string;
  role: UserRole;
  token: string;
}

declare module 'express-serve-static-core' {
  export interface Request {
    user?: RequestUser;
  }
}
