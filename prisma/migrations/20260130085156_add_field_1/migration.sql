/*
  Warnings:

  - Added the required column `hourlyRate` to the `tutor_profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutor_profile" ADD COLUMN     "hourlyRate" SMALLINT NOT NULL;
