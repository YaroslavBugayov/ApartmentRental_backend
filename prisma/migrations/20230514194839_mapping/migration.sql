/*
  Warnings:

  - You are about to drop the `Keywords` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `gender` on the `Profile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- DropForeignKey
ALTER TABLE "Keywords" DROP CONSTRAINT "Keywords_profileId_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "gender",
ADD COLUMN     "gender" "Gender" NOT NULL;

-- DropTable
DROP TABLE "Keywords";

-- DropEnum
DROP TYPE "Genger";

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "profileId" INTEGER NOT NULL,
    "word" TEXT NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
