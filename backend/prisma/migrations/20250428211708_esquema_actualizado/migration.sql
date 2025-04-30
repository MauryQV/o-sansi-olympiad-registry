-- DropForeignKey
ALTER TABLE "Area_convocatoria" DROP CONSTRAINT "Area_convocatoria_convocatoria_id_fkey";

-- AddForeignKey
ALTER TABLE "Area_convocatoria" ADD CONSTRAINT "Area_convocatoria_convocatoria_id_fkey" FOREIGN KEY ("convocatoria_id") REFERENCES "Convocatoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
