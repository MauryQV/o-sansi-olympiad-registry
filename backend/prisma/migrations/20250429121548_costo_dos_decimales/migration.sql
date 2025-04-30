/*
  Warnings:

  - You are about to alter the column `costo` on the `Area` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Area" ALTER COLUMN "costo" SET DATA TYPE DECIMAL(10,2);
