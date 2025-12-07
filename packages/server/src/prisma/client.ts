import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { resolve } from 'node:path';
import { PrismaClient } from './generated/prisma/client';

function resolveDatabaseUrl(url: string | undefined): string {
  if (!url) {
    return 'file:./dev.db';
  }

  if (url.startsWith('file:')) {
    const filePath = url.replace('file:', '');
    return `file:${resolve(__dirname, filePath)}`;
  }

  return url;
}

// Create the libSQL adapter with resolved database URL
const adapter = new PrismaBetterSqlite3({
  url: resolveDatabaseUrl(process.env.DATABASE_URL),
});

// Create a single instance of PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
