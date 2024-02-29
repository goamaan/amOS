/*
  Warnings:

  - You are about to drop the column `excerpt` on the `Work` table. All the data in the column will be lost.
  - Added the required column `description` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Work" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "featureImage" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Work_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Work" ("createdAt", "featureImage", "id", "publishedAt", "slug", "text", "title", "updatedAt", "userId") SELECT "createdAt", "featureImage", "id", "publishedAt", "slug", "text", "title", "updatedAt", "userId" FROM "Work";
DROP TABLE "Work";
ALTER TABLE "new_Work" RENAME TO "Work";
CREATE UNIQUE INDEX "Work_slug_key" ON "Work"("slug");
CREATE INDEX "Work_publishedAt_idx" ON "Work"("publishedAt");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
