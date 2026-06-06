-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ChatHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messages" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ChatHistory_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ChatHistory" ("createdAt", "id", "lessonId", "messages", "updatedAt", "userId") SELECT "createdAt", "id", "lessonId", "messages", "updatedAt", "userId" FROM "ChatHistory";
DROP TABLE "ChatHistory";
ALTER TABLE "new_ChatHistory" RENAME TO "ChatHistory";
CREATE TABLE "new_QuizResult" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "feedback" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "QuizResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "QuizResult_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_QuizResult" ("createdAt", "feedback", "id", "lessonId", "passed", "score", "total", "userId") SELECT "createdAt", "feedback", "id", "lessonId", "passed", "score", "total", "userId" FROM "QuizResult";
DROP TABLE "QuizResult";
ALTER TABLE "new_QuizResult" RENAME TO "QuizResult";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
