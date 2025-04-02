/*
  Warnings:

  - Added the required column `metodo_pago_id` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Competidor" ALTER COLUMN "fecha_nacimiento" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Inscripcion_tutor" ADD COLUMN     "fecha_aprobacion" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "metodo_pago_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "MetodoPago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "MetodoPago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MetodoPago_nombre_key" ON "MetodoPago"("nombre");

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "MetodoPago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
