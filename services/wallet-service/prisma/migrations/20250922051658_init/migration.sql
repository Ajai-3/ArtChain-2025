-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('credited', 'debited');

-- CreateEnum
CREATE TYPE "public"."Method" AS ENUM ('strpe', 'razorpay');

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "method" "public"."Method" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "public"."Wallet"("userId");

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "public"."Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
