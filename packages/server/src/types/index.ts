import { UserRole } from '../models/user.model';

export interface RequestUser {
  id: string;
  role: UserRole;
  token: string;
}
