/*
  Warnings:

  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - A unique constraint covering the columns `[externalId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_externalId_key" ON "public"."Transaction"("externalId");
