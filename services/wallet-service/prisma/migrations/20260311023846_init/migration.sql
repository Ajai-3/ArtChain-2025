-- CreateEnum
CREATE TYPE "WithdrawalMethod" AS ENUM ('BANK_TRANSFER', 'UPI');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED', 'FAILED');

-- AlterEnum
ALTER TYPE "Method" ADD VALUE 'art_coin';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionCategory" ADD VALUE 'AUCTION_FEE';
ALTER TYPE "TransactionCategory" ADD VALUE 'SALE_FEE';
ALTER TYPE "TransactionCategory" ADD VALUE 'COMMISSION_FEE';
ALTER TYPE "TransactionCategory" ADD VALUE 'GIFT';

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "quickStats" JSONB,
ADD COLUMN     "transactionSummary" JSONB;

-- CreateTable
CREATE TABLE "WithdrawalRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "WithdrawalMethod" NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'PENDING',
    "accountHolderName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "upiId" TEXT,
    "transactionId" TEXT,
    "rejectionReason" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WithdrawalRequest_transactionId_key" ON "WithdrawalRequest"("transactionId");

-- CreateIndex
CREATE INDEX "WithdrawalRequest_userId_idx" ON "WithdrawalRequest"("userId");

-- CreateIndex
CREATE INDEX "WithdrawalRequest_walletId_idx" ON "WithdrawalRequest"("walletId");

-- CreateIndex
CREATE INDEX "WithdrawalRequest_status_idx" ON "WithdrawalRequest"("status");
