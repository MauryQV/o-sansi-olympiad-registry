/*
  Warnings:

  - Added the required column `id_nivel` to the `Grado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grado" ADD COLUMN     "id_nivel" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    "nombre_nivel" TEXT NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Grado" ADD CONSTRAINT "Grado_id_nivel_fkey" FOREIGN KEY ("id_nivel") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
