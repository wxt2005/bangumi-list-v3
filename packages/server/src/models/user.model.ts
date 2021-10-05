import bcrypt from 'bcrypt';
import crypto from 'crypto';
import db from '../db';
import { User } from 'bangumi-list-v3-shared';
import tokenModel from './token.model';

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
  private tableName = 'users';

  public async initDB() {
    await db.run(`
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    ) WITHOUT ROWID;`);
  }

  public async addUser(
    newUserData: NewUserData,
    role: UserRole = UserRole.REGULAR
  ): Promise<string> {
    const { email, password } = newUserData;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const now = Date.now();
    const userID = crypto.randomBytes(16).toString('hex');
    try {
      await db.run(
        `
      INSERT INTO ${this.tableName} (id, email, password, role, created_at, updated_at)
      VALUES($userID, $email, $password, $role, $createdAt, $updatedAt);
    `,
        {
          $userID: userID,
          $email: email,
          $password: passwordHash,
          $role: role,
          $createdAt: now,
          $updatedAt: now,
        }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
    return userID;
  }

  public async getUser(userID: string): Promise<UserFull | null> {
    const row = await db.get(
      `SELECT * FROM ${this.tableName} WHERE id = $userID`,
      {
        $userID: userID,
      }
    );
    if (!row) return null;

    return {
      id: row.id,
      role: row.role,
      email: row.email,
      password: row.password,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  public async checkEmailValid(email: string): Promise<boolean> {
    if (!email) return false;
    const row = await db.get(
      `SELECT * FROM ${this.tableName} WHERE email = $email`,
      {
        $email: email,
      }
    );
    if (row) return false;
    return true;
  }

  public async verifyUserByEmail(
    email: string,
    password: string
  ): Promise<UserFull | null> {
    let user: UserFull;
    try {
      user = await db.get(
        `
        SELECT *
        FROM ${this.tableName}
        WHERE
          email = $email
        `,
        {
          $email: email,
        }
      );
    } catch (error) {
      console.error(error);
      return null;
    }
    if (!user) return null;
    const isSuccess = await bcrypt.compare(password, user.password || '');
    if (isSuccess) return user;
    return null;
  }

  public async verifyUserByID(
    id: string,
    password: string
  ): Promise<UserFull | null> {
    let user: UserFull;
    try {
      user = await db.get(
        `
        SELECT *
        FROM ${this.tableName}
        WHERE
          id = $id
        `,
        {
          $id: id,
        }
      );
    } catch (error) {
      console.error(error);
      return null;
    }
    if (!user) return null;
    const isSuccess = await bcrypt.compare(password, user.password || '');
    if (isSuccess) return user;
    return null;
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
    const now = Date.now();
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await db.run(
      `
      UPDATE ${this.tableName}
      SET
        password = $password,
        updated_at = $updatedAt
      WHERE
        id = $userID
    `,
      {
        $userID: userID,
        $password: passwordHash,
        $updatedAt: now,
      }
    );

    await tokenModel.clearTokens(userID);
  }
}

export default new UserModel();
