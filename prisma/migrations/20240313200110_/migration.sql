/*
  Warnings:

  - Made the column `description` on table `Bookmark` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `Bookmark` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "host" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "faviconUrl" TEXT,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "BookmarkTag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("createdAt", "description", "faviconUrl", "host", "id", "tagId", "title", "updatedAt", "url") SELECT "createdAt", "description", "faviconUrl", "host", "id", "tagId", "title", "updatedAt", "url" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_url_key" ON "Bookmark"("url");
CREATE INDEX "Bookmark_tagId_idx" ON "Bookmark"("tagId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
