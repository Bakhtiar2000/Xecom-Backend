/*
  Warnings:

  - You are about to drop the `product_tags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_tags" DROP CONSTRAINT "product_tags_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_tags" DROP CONSTRAINT "product_tags_tagId_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_tenantId_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "product_tags";

-- DropTable
DROP TABLE "tags";
