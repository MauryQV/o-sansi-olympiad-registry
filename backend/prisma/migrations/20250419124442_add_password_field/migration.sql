/*
  Warnings:

  - Added the required column `password` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Inscripcion_area" (
    "id" SERIAL NOT NULL,
    "competidor_id" TEXT NOT NULL,
    "area_id" INTEGER NOT NULL,
    "convocatoria_id" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inscripcion_area_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inscripcion_area" ADD CONSTRAINT "Inscripcion_area_competidor_id_fkey" FOREIGN KEY ("competidor_id") REFERENCES "Competidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_area" ADD CONSTRAINT "Inscripcion_area_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_area" ADD CONSTRAINT "Inscripcion_area_convocatoria_id_fkey" FOREIGN KEY ("convocatoria_id") REFERENCES "Convocatoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
