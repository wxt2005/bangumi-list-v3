import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { resolve } from 'node:path';

/**
 * Resolves the database URL, converting relative file paths to absolute paths.
 * This is necessary because Prisma 7 with adapters resolves paths relative to
 * the generated client location, not the project root.
 */
function resolveDatabaseUrl(url: string | undefined): string {
  if (!url) {
    return 'file:./dev.db';
  }

  if (url.startsWith('file:')) {
    const filePath = url.replace('file:', '');
    return `file:${resolve(process.cwd(), filePath)}`;
  }

  return url;
}

// Create the libSQL adapter with resolved database URL
const adapter = new PrismaLibSql({
  url: resolveDatabaseUrl(process.env.DATABASE_URL),
});

// Create a single instance of PrismaClient with the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
