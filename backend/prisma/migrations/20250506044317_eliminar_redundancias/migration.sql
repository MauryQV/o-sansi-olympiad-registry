/*
  Warnings:

  - You are about to drop the column `motivoRechazoId` on the `Inscripcion_tutor` table. All the data in the column will be lost.
  - You are about to drop the `MotivoRechazo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inscripcion_tutor" DROP CONSTRAINT "Inscripcion_tutor_motivoRechazoId_fkey";

-- AlterTable
ALTER TABLE "Inscripcion_tutor" DROP COLUMN "motivoRechazoId";

-- DropTable
DROP TABLE "MotivoRechazo";

-- CreateTable
CREATE TABLE "Motivo_rechazo" (
    "id" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,

    CONSTRAINT "Motivo_rechazo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inscripcion_tutor" ADD CONSTRAINT "Inscripcion_tutor_motivo_rechazo_id_fkey" FOREIGN KEY ("motivo_rechazo_id") REFERENCES "Motivo_rechazo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
