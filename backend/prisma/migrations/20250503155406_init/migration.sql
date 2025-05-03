/*
  Warnings:

  - You are about to drop the column `competidor_id` on the `Inscripcion_tutor` table. All the data in the column will be lost.
  - You are about to drop the `Inscripcion_area` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `area_id` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `competidor_id` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `convocatoria_id` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Inscripcion_area" DROP CONSTRAINT "Inscripcion_area_area_id_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion_area" DROP CONSTRAINT "Inscripcion_area_competidor_id_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion_area" DROP CONSTRAINT "Inscripcion_area_convocatoria_id_fkey";

-- DropForeignKey
ALTER TABLE "Inscripcion_tutor" DROP CONSTRAINT "Inscripcion_tutor_competidor_id_fkey";

-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "area_id" INTEGER NOT NULL,
ADD COLUMN     "competidor_id" TEXT NOT NULL,
ADD COLUMN     "convocatoria_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Inscripcion_tutor" DROP COLUMN "competidor_id",
ADD COLUMN     "competidorId" TEXT;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "Inscripcion_area";

-- AddForeignKey
ALTER TABLE "Inscripcion_tutor" ADD CONSTRAINT "Inscripcion_tutor_competidorId_fkey" FOREIGN KEY ("competidorId") REFERENCES "Competidor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_competidor_id_fkey" FOREIGN KEY ("competidor_id") REFERENCES "Competidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_convocatoria_id_fkey" FOREIGN KEY ("convocatoria_id") REFERENCES "Convocatoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
