-- CreateTable
CREATE TABLE "BangumiPreference_new" (
    "userID" TEXT NOT NULL PRIMARY KEY,
    "watching" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Preference_new" (
    "userID" TEXT NOT NULL PRIMARY KEY,
    "common" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Token_new" (
    "userID" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    PRIMARY KEY ("userID", "token")
);

-- CreateTable
CREATE TABLE "User_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
INSERT INTO "User_new" ("createdAt", "email", "id", "password", "role", "updatedAt") SELECT "created_at", "email", "id", "password", "role", "updated_at" FROM "users";
DROP TABLE "users";
ALTER TABLE "User_new" RENAME TO "User";
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_user_2" ON "User"("email");
Pragma writable_schema=0;

INSERT INTO "BangumiPreference_new" ("createdAt", "updatedAt", "userID", "watching") SELECT "created_at", "updated_at", "user_id", "watching" FROM "bangumiPreference";
DROP TABLE "bangumiPreference";
ALTER TABLE "BangumiPreference_new" RENAME TO "BangumiPreference";

INSERT INTO "Preference_new" ("common", "createdAt", "updatedAt", "userID") SELECT "common", "created_at", "updated_at", "user_id" FROM "preference";
DROP TABLE "preference";
ALTER TABLE "Preference_new" RENAME TO "Preference";

INSERT INTO "Token_new" ("userID", "token") SELECT "user_id", "token" FROM "tokens";
DROP TABLE "tokens";
ALTER TABLE "Token_new" RENAME TO "Token";

PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
