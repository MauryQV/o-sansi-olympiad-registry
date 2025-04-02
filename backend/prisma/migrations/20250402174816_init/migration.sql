/*
  Warnings:

  - You are about to drop the `MetodoPago` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pago" DROP CONSTRAINT "Pago_metodo_pago_id_fkey";

-- DropTable
DROP TABLE "MetodoPago";

-- CreateTable
CREATE TABLE "Metodo_pago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Metodo_pago_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metodo_pago_nombre_key" ON "Metodo_pago"("nombre");

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "Metodo_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
