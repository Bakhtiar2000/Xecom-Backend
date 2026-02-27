/*
  Warnings:

  - The `preferredCurrency` column on the `customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currency` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currency` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `unit` column on the `product_dimensions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'OFFICE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductDimensionUnit" AS ENUM ('CM', 'INCH', 'METER', 'FOOT', 'YARD');

-- CreateEnum
CREATE TYPE "ProductWeightUnit" AS ENUM ('KG', 'G', 'LB', 'OZ');

-- CreateEnum
CREATE TYPE "TargetAudience" AS ENUM ('MEN', 'WOMEN', 'KIDS');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'EUR', 'BDT');

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "addressType" "AddressType";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "targetAudience" "TargetAudience"[];

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "preferredCurrency",
ADD COLUMN     "preferredCurrency" "Currency" DEFAULT 'USD';

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "currency",
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "product_dimensions" DROP COLUMN "unit",
ADD COLUMN     "unit" "ProductDimensionUnit" DEFAULT 'CM';

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "weightUnit" "ProductWeightUnit" DEFAULT 'G';
