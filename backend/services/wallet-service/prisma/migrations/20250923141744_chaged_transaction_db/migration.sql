-- CreateEnum
CREATE TYPE "public"."TransactionCategory" AS ENUM ('TOP_UP', 'SALE', 'PURCHASE', 'WITHDRAWAL', 'COMMISSION', 'REFUND', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "category" "public"."TransactionCategory" NOT NULL DEFAULT 'OTHER',
ALTER COLUMN "externalId" DROP NOT NULL;
