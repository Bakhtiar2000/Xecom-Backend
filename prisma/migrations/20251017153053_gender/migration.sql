/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF', 'CUSTOMER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" "Gender",
DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';

-- DropEnum
DROP TYPE "public"."Role";
