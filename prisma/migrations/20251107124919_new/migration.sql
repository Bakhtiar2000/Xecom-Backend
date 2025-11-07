/*
  Warnings:

  - You are about to drop the column `department` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `isVip` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - Made the column `employeeId` on table `admins` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "department",
ALTER COLUMN "employeeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "isVip";

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "phone",
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone",
ADD COLUMN     "phoneNumber" TEXT;
