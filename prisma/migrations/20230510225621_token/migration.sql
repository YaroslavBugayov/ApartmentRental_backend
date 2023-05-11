/*
  Warnings:

  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(1000)` to `VarChar(200)`.
  - Added the required column `refreshToken` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "token" ADD COLUMN     "refreshToken" VARCHAR(200) NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "password" SET DATA TYPE VARCHAR(200);
