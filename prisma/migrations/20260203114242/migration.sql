/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value]` on the table `AttributeValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[hexCode]` on the table `AttributeValue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AttributeValue" ADD COLUMN     "hexCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Attribute_name_key" ON "Attribute"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_value_key" ON "AttributeValue"("value");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeValue_hexCode_key" ON "AttributeValue"("hexCode");
