/*
  Warnings:

  - Added the required column `costo` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "costo" DECIMAL(65,30) NOT NULL;
