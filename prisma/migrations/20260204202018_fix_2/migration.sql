/*
  Warnings:

  - Added the required column `updatedAt` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;
