import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { resolve } from 'node:path';

// Create the libSQL adapter with absolute path to database file
const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL
    ? process.env.DATABASE_URL.startsWith('file:')
      ? `file:${resolve(process.cwd(), process.env.DATABASE_URL.replace('file:', ''))}`
      : process.env.DATABASE_URL
    : 'file:./dev.db',
});

// Create a single instance of PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
