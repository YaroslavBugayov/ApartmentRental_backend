/*
  Warnings:

  - You are about to drop the column `profileId` on the `Keyword` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Keyword" DROP CONSTRAINT "Keyword_profileId_fkey";

-- AlterTable
ALTER TABLE "Keyword" DROP COLUMN "profileId";

-- CreateTable
CREATE TABLE "_ProfileKeywords" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileKeywords_AB_unique" ON "_ProfileKeywords"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileKeywords_B_index" ON "_ProfileKeywords"("B");

-- AddForeignKey
ALTER TABLE "_ProfileKeywords" ADD CONSTRAINT "_ProfileKeywords_A_fkey" FOREIGN KEY ("A") REFERENCES "Keyword"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileKeywords" ADD CONSTRAINT "_ProfileKeywords_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
