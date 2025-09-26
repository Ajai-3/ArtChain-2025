/*
  Warnings:

  - The values [strpe] on the enum `Method` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('pending', 'success', 'failed');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Method_new" AS ENUM ('stripe', 'razorpay');
ALTER TABLE "public"."Transaction" ALTER COLUMN "method" TYPE "public"."Method_new" USING ("method"::text::"public"."Method_new");
ALTER TYPE "public"."Method" RENAME TO "Method_old";
ALTER TYPE "public"."Method_new" RENAME TO "Method";
DROP TYPE "public"."Method_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "meta" JSONB,
ADD COLUMN     "status" "public"."TransactionStatus" NOT NULL DEFAULT 'pending',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(65,30);
