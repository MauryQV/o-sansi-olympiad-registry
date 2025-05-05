-- Añadir campo estado a la tabla Usuario con valor predeterminado true
ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "estado" BOOLEAN NOT NULL DEFAULT true; 