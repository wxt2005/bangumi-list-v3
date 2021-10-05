import path from 'path';
import sqlite3, { Database } from 'sqlite3';
import { DB_DIR, DB_FILE } from './config';

class DB {
  private dbPath: string;
  private db?: Database;

  constructor() {
    this.dbPath = path.resolve(DB_DIR, DB_FILE);
  }

  async init(): Promise<Database> {
    return new Promise((resolve, reject) => {
      const db = new (sqlite3.verbose().Database)(this.dbPath, (error) => {
        if (error) return reject(error);
        this.db = db;
        resolve(db);
      });
    });
  }

  async getInstance(): Promise<Database> {
    if (!this.db) return Promise.reject(new Error('DB not inited'));
    return Promise.resolve(this.db);
  }

  async run(sql: string, params?: any): Promise<void> {
    const db = await this.getInstance();
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (error: Error) {
        if (error) return reject(error);
        resolve();
      });
    });
  }

  async get(sql: string, params?: any): Promise<any> {
    const db = await this.getInstance();
    return new Promise((resolve, reject) => {
      db.get(sql, params, function (error: Error, row: any) {
        if (error) return reject(error);
        resolve(row);
      });
    });
  }
}

export default new DB();
