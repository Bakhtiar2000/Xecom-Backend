-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('EMAIL_PASSWORD', 'GOOGLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" "AuthProvider" DEFAULT 'EMAIL_PASSWORD',
ALTER COLUMN "password" DROP NOT NULL;
