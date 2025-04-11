/*
  Warnings:

  - Added the required column `descripcion_area` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "descripcion_area" TEXT NOT NULL;
