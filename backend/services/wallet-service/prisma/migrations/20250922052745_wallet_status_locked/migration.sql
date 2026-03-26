-- CreateEnum
CREATE TYPE "public"."WalletStatus" AS ENUM ('active', 'locked', 'suspended');

-- AlterTable
ALTER TABLE "public"."Wallet" ADD COLUMN     "lockedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" "public"."WalletStatus" NOT NULL DEFAULT 'active';
