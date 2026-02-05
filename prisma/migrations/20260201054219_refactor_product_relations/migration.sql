/*
  Warnings:

  - You are about to drop the column `bundleProducts` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `crossSellProducts` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `relatedProducts` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `upSellProducts` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductRelationType" AS ENUM ('RELATED', 'CROSS_SELL', 'UP_SELL');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "bundleProducts",
DROP COLUMN "crossSellProducts",
DROP COLUMN "relatedProducts",
DROP COLUMN "upSellProducts";

-- CreateTable
CREATE TABLE "product_relations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "productId" TEXT NOT NULL,
    "relatedToId" TEXT NOT NULL,
    "type" "ProductRelationType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_relations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_relations_productId_type_idx" ON "product_relations"("productId", "type");

-- CreateIndex
CREATE INDEX "product_relations_relatedToId_idx" ON "product_relations"("relatedToId");

-- CreateIndex
CREATE UNIQUE INDEX "product_relations_tenantId_productId_relatedToId_type_key" ON "product_relations"("tenantId", "productId", "relatedToId", "type");

-- AddForeignKey
ALTER TABLE "product_relations" ADD CONSTRAINT "product_relations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_relations" ADD CONSTRAINT "product_relations_relatedToId_fkey" FOREIGN KEY ("relatedToId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
