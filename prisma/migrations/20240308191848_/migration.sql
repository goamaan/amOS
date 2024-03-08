/*
  Warnings:

  - You are about to drop the column `commentId` on the `Reaction` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "bookmarkId" TEXT,
    "questionId" TEXT,
    "postId" TEXT,
    "stackId" TEXT,
    CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reaction_bookmarkId_fkey" FOREIGN KEY ("bookmarkId") REFERENCES "Bookmark" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reaction_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Reaction_stackId_fkey" FOREIGN KEY ("stackId") REFERENCES "Stack" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Reaction" ("bookmarkId", "createdAt", "id", "postId", "questionId", "stackId", "userId") SELECT "bookmarkId", "createdAt", "id", "postId", "questionId", "stackId", "userId" FROM "Reaction";
DROP TABLE "Reaction";
ALTER TABLE "new_Reaction" RENAME TO "Reaction";
CREATE INDEX "Reaction_bookmarkId_idx" ON "Reaction"("bookmarkId");
CREATE INDEX "Reaction_questionId_idx" ON "Reaction"("questionId");
CREATE INDEX "Reaction_postId_idx" ON "Reaction"("postId");
CREATE INDEX "Reaction_stackId_idx" ON "Reaction"("stackId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
