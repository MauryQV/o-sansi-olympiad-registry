/*
  Warnings:

  - Added the required column `categoria_id` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "categoria_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
