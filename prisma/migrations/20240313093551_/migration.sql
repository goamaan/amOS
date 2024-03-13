/*
  Warnings:

  - You are about to drop the column `image` on the `Bookmark` table. All the data in the column will be lost.
  - Added the required column `host` to the `Bookmark` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmark" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "host" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "faviconUrl" TEXT,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "Bookmark_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "BookmarkTag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bookmark" ("createdAt", "description", "faviconUrl", "id", "tagId", "title", "updatedAt", "url") SELECT "createdAt", "description", "faviconUrl", "id", "tagId", "title", "updatedAt", "url" FROM "Bookmark";
DROP TABLE "Bookmark";
ALTER TABLE "new_Bookmark" RENAME TO "Bookmark";
CREATE UNIQUE INDEX "Bookmark_url_key" ON "Bookmark"("url");
CREATE INDEX "Bookmark_tagId_idx" ON "Bookmark"("tagId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
