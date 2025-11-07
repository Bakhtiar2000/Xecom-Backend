/*
  Warnings:

  - You are about to drop the column `code` on the `districts` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `divisions` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `thanas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "districts" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "divisions" DROP COLUMN "code";

-- AlterTable
ALTER TABLE "thanas" DROP COLUMN "code";
