/*
  Warnings:

  - You are about to drop the column `password` on the `Tutor` table. All the data in the column will be lost.
  - Added the required column `password` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tutor" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "password" TEXT NOT NULL;
