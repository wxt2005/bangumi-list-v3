import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { User } from 'bangumi-list-v3-shared';
import tokenModel from './token.model';
import { PrismaClient, User as UserRow } from '@prisma/client';

const prisma = new PrismaClient();

const saltRounds = 10;

export enum UserRole {
  REGULAR = 0,
  ADMIN = 999,
}
export interface NewUserData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  password?: string;
}
export interface UserFull extends User {
  password: string;
  role: UserRole;
  createdAt: number;
  updatedAt: number;
}

class UserModel {
  public async addUser(
    newUserData: NewUserData,
    role: UserRole = UserRole.REGULAR
  ): Promise<string> {
    const { email, password } = newUserData;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const now = new Date();
    const userID = crypto.randomBytes(16).toString('hex');
    try {
      await prisma.user.create({
        data: {
          id: userID,
          email,
          password: passwordHash,
          role,
          createdAt: now,
          updatedAt: now,
        },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
    return userID;
  }

  public async getUser(userID: string): Promise<UserFull | null> {
    const row = await prisma.user.findUnique({
      where: {
        id: userID,
      },
    });
    if (!row) return null;

    return {
      id: row.id,
      role: row.role,
      email: row.email,
      password: row.password,
      createdAt: row.createdAt.getTime(),
      updatedAt: row.updatedAt.getTime(),
    };
  }

  public async checkEmailValid(email: string): Promise<boolean> {
    if (!email) return false;
    const row = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (row) return false;
    return true;
  }

  public async verifyUserByEmail(
    email: string,
    password: string
  ): Promise<UserFull | null> {
    let row: UserRow | null;
    try {
      row = await prisma.user.findFirst({
        where: {
          email,
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
    if (!row) return null;
    const isSuccess = await bcrypt.compare(password, row.password || '');
    if (!isSuccess) return null;
    return {
      id: row.id,
      role: row.role,
      email: row.email,
      password: row.password,
      createdAt: row.createdAt.getTime(),
      updatedAt: row.updatedAt.getTime(),
    };
  }

  public async verifyUserByID(
    id: string,
    password: string
  ): Promise<UserFull | null> {
    let row: UserRow | null;
    try {
      row = await prisma.user.findFirst({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error(error);
      return null;
    }
    if (!row) return null;
    const isSuccess = await bcrypt.compare(password, row.password || '');
    if (!isSuccess) return null;
    return {
      id: row.id,
      role: row.role,
      email: row.email,
      password: row.password,
      createdAt: row.createdAt.getTime(),
      updatedAt: row.updatedAt.getTime(),
    };
  }

  public async createAdminIfNotExist() {
    const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123456';
    const isValid = await this.checkEmailValid(email);
    if (!isValid) {
      return;
    }

    await this.addUser(
      {
        email,
        password,
      },
      UserRole.ADMIN
    );
  }

  public async changePassword(
    userID: string,
    newPassword: string
  ): Promise<void> {
    const now = new Date();
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await prisma.user.update({
      where: {
        id: userID,
      },
      data: {
        password: passwordHash,
        updatedAt: now,
      },
    });

    await tokenModel.clearTokens(userID);
  }
}

export default new UserModel();
