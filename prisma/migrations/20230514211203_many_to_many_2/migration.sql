/*
  Warnings:

  - You are about to drop the `_ProfileKeywords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProfileKeywords" DROP CONSTRAINT "_ProfileKeywords_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfileKeywords" DROP CONSTRAINT "_ProfileKeywords_B_fkey";

-- DropTable
DROP TABLE "_ProfileKeywords";

-- CreateTable
CREATE TABLE "ProfileKeyword" (
    "profileId" INTEGER NOT NULL,
    "keywordId" INTEGER NOT NULL,

    CONSTRAINT "ProfileKeyword_pkey" PRIMARY KEY ("profileId","keywordId")
);

-- AddForeignKey
ALTER TABLE "ProfileKeyword" ADD CONSTRAINT "ProfileKeyword_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileKeyword" ADD CONSTRAINT "ProfileKeyword_keywordId_fkey" FOREIGN KEY ("keywordId") REFERENCES "Keyword"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
