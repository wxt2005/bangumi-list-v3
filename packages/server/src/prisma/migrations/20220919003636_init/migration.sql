-- CreateTable
CREATE TABLE "BangumiPreference" (
    "userID" TEXT NOT NULL PRIMARY KEY,
    "watching" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Preference" (
    "userID" TEXT NOT NULL PRIMARY KEY,
    "common" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Token" (
    "userID" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    PRIMARY KEY ("userID", "token")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
Pragma writable_schema=1;
CREATE UNIQUE INDEX "sqlite_autoindex_user_2" ON "User"("email");
Pragma writable_schema=0;
