# Prisma Development Guide

This guide covers how to work with Prisma ORM when developing locally for bangumi-list-v3.

## Overview

This project uses [Prisma ORM](https://www.prisma.io/) v7.1.0 with SQLite as the database. Prisma provides type-safe database access and automatic schema migrations.

**Note:** Prisma 7 introduces significant changes, including:
- Database configuration moved from `schema.prisma` to `prisma.config.ts`
- PrismaClient now requires an adapter for direct database connections
- This project uses `@prisma/adapter-libsql` for SQLite connectivity

## Quick Reference

```bash
# Generate Prisma Client after schema changes
npm run prisma:generate

# Create a new migration after schema changes
npx prisma migrate dev --name <migration_name>

# Apply migrations to production database
npx prisma migrate deploy

# Reset database (CAUTION: deletes all data)
npm run prisma:migrate:reset

# Seed the database with initial data
npx prisma db seed

# Open Prisma Studio (GUI for database)
npx prisma studio
```

## Initial Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp packages/server/.env.example packages/server/.env
   ```

3. **Configure database URL in `.env`**
   ```bash
   DATABASE_URL=file:../../.run/db.db
   ```

4. **Generate Prisma Client**
   ```bash
   cd packages/server
   npm run prisma:generate
   ```

5. **Run migrations to create database schema**
   ```bash
   cd packages/server
   npx prisma migrate dev
   ```

## Configuration

### Prisma Configuration File

The project uses `prisma.config.ts` (Prisma v7 format) located at `packages/server/prisma.config.ts`:

```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './src/prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'ts-node ./src/prisma/seed.ts',
  },
});
```

### Schema Location

The Prisma schema is located at `packages/server/src/prisma/schema.prisma`.

## Common Development Tasks

### 1. Modifying the Database Schema

When you need to add or modify database tables:

1. **Edit the schema file**
   ```bash
   # Edit packages/server/src/prisma/schema.prisma
   ```

2. **Create a migration**
   ```bash
   cd packages/server
   npx prisma migrate dev --name add_new_table
   ```
   This will:
   - Create a new migration file in `src/prisma/migrations/`
   - Apply the migration to your local database
   - Regenerate the Prisma Client

3. **Commit the migration**
   ```bash
   git add src/prisma/migrations/
   git commit -m "Add migration for new table"
   ```

### 2. Generating Prisma Client

The Prisma Client needs to be regenerated whenever:
- You change the schema
- You pull changes that include schema updates
- After initial installation

```bash
cd packages/server
npm run prisma:generate
# or
npx prisma generate
```

### 3. Seeding the Database

To populate the database with initial data:

```bash
cd packages/server
npx prisma db seed
```

The seed script is located at `packages/server/src/prisma/seed.ts`.

### 4. Resetting the Database

**⚠️ WARNING**: This will delete all data in your database.

```bash
cd packages/server
npm run prisma:migrate:reset
# or
npx prisma migrate reset
```

This command will:
1. Drop the database
2. Create a new database
3. Apply all migrations
4. Run the seed script (if configured)

### 5. Using Prisma Studio

Prisma Studio is a GUI for viewing and editing data:

```bash
cd packages/server
npx prisma studio
```

This will open a browser window at `http://localhost:5555` with the database viewer.

## Database Migrations

### Creating Migrations

Migrations are automatically created when you run:

```bash
npx prisma migrate dev --name <descriptive_name>
```

Example:
```bash
npx prisma migrate dev --name add_user_preferences
```

### Migration Files

Migrations are stored in `packages/server/src/prisma/migrations/`. Each migration folder contains:
- `migration.sql` - The SQL commands to apply the migration
- Timestamp in the folder name for ordering

### Applying Migrations in Production

For production deployments:

```bash
npx prisma migrate deploy
```

This applies pending migrations without prompting or modifying the schema.

## Schema Examples

### Adding a New Model

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Adding Relations

```prisma
model User {
  id    String  @id
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

## Troubleshooting

### Error: "Prisma schema loaded from ..."

If you see an error about schema location, ensure:
- You're in the correct directory (`packages/server`)
- The `prisma.config.ts` file exists
- The schema path in config is correct

### Error: "Missing environment variable"

Ensure your `.env` file exists and contains `DATABASE_URL`:

```bash
cd packages/server
cat .env | grep DATABASE_URL
```

### Error: "Prisma Client is not generated"

Run the generate command:

```bash
cd packages/server
npm run prisma:generate
```

### Migration Conflicts

If you have migration conflicts after pulling changes:

```bash
# Option 1: Reset database (loses local data)
npx prisma migrate reset

# Option 2: Resolve manually
npx prisma migrate resolve --applied <migration_name>
```

## Best Practices

1. **Always commit migrations**: Migration files should be version controlled
2. **Run migrations in order**: Don't skip or reorder migrations
3. **Test migrations**: Test schema changes in development before production
4. **Use descriptive names**: Give migrations clear, descriptive names
5. **Generate client after changes**: Always regenerate Prisma Client after schema changes
6. **Keep schema simple**: Start with simple schemas and iterate
7. **Use transactions**: For complex operations, use Prisma transactions

## Useful Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Prisma v7 Migration Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Prisma Schema Reference](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/orm/prisma-client)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)

## Project-Specific Notes

- Database: SQLite (via libSQL adapter)
- Database file location: `.run/db.db` (relative to project root)
- Schema location: `packages/server/src/prisma/schema.prisma`
- Migrations location: `packages/server/src/prisma/migrations/`
- Seed script: `packages/server/src/prisma/seed.ts`
- Prisma Client: `packages/server/src/prisma/client.ts` (shared singleton with adapter)

### Prisma Client Usage

This project uses a shared Prisma Client instance configured with the libSQL adapter. Always import from:

```typescript
import prisma from '../prisma/client';

// Use the client
const users = await prisma.user.findMany();
```

**Do not** create new PrismaClient instances directly. The shared client is properly configured with the database adapter and connection settings.
