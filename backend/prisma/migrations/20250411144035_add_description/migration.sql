/*
  Warnings:

  - Added the required column `descripcion_convocatoria` to the `Convocatoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Convocatoria" ADD COLUMN     "descripcion_convocatoria" TEXT NOT NULL;
