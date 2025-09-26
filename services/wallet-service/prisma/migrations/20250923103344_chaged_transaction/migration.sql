/*
  Warnings:

  - Made the column `description` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `externalId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "externalId" SET NOT NULL;
