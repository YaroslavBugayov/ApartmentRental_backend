/*
  Warnings:

  - A unique constraint covering the columns `[word]` on the table `Keyword` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Keyword_word_key" ON "Keyword"("word");
