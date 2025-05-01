/*
  Warnings:

  - Added the required column `area_id` to the `Tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tutor" ADD COLUMN     "area_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
