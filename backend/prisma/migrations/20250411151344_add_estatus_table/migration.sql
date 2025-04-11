/*
  Warnings:

  - You are about to drop the column `estado` on the `Convocatoria` table. All the data in the column will be lost.
  - Added the required column `id_estado_convocatoria` to the `Convocatoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Convocatoria" DROP COLUMN "estado",
ADD COLUMN     "id_estado_convocatoria" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "estado_convocatoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estado_convocatoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "estado_convocatoria_nombre_key" ON "estado_convocatoria"("nombre");

-- AddForeignKey
ALTER TABLE "Convocatoria" ADD CONSTRAINT "Convocatoria_id_estado_convocatoria_fkey" FOREIGN KEY ("id_estado_convocatoria") REFERENCES "estado_convocatoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
