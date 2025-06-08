-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "correo_electronico" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permiso" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rol_permiso" (
    "id" SERIAL NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,

    CONSTRAINT "Rol_permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Competidor" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "colegio_id" INTEGER NOT NULL,
    "provincia_id" INTEGER NOT NULL,
    "carnet_identidad" TEXT NOT NULL,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Competidor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tutor" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "carnet_identidad" TEXT NOT NULL,
    "numero_celular" TEXT NOT NULL,
    "area_id" INTEGER NOT NULL,

    CONSTRAINT "Tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" SERIAL NOT NULL,
    "nombre_departamento" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "id" SERIAL NOT NULL,
    "nombre_provincia" TEXT NOT NULL,
    "departamento_id" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colegio" (
    "id" SERIAL NOT NULL,
    "nombre_colegio" TEXT NOT NULL,
    "provincia_id" INTEGER NOT NULL,

    CONSTRAINT "Colegio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Convocatoria" (
    "id" SERIAL NOT NULL,
    "nombre_convocatoria" TEXT NOT NULL,
    "id_estado_convocatoria" INTEGER NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "pago_fin" TIMESTAMP(3) NOT NULL,
    "pago_inicio" TIMESTAMP(3) NOT NULL,
    "competicion_inicio" TIMESTAMP(3) NOT NULL,
    "competicion_fin" TIMESTAMP(3) NOT NULL,
    "descripcion_convocatoria" TEXT NOT NULL,

    CONSTRAINT "Convocatoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" SERIAL NOT NULL,
    "nombre_area" TEXT NOT NULL,
    "descripcion_area" TEXT NOT NULL,
    "costo" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre_categoria" TEXT NOT NULL,
    "grado_min_id" INTEGER NOT NULL,
    "grado_max_id" INTEGER NOT NULL,
    "descripcion_cat" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grado" (
    "id" SERIAL NOT NULL,
    "nombre_grado" TEXT NOT NULL,
    "id_nivel" INTEGER NOT NULL,

    CONSTRAINT "Grado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "inscripcion_id" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'Pendiente',
    "codigo_pago" TEXT NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metodo_pago_id" INTEGER NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area_convocatoria" (
    "id" SERIAL NOT NULL,
    "area_id" INTEGER NOT NULL,
    "convocatoria_id" INTEGER NOT NULL,

    CONSTRAINT "Area_convocatoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria_area" (
    "id" SERIAL NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "area_id" INTEGER NOT NULL,

    CONSTRAINT "Categoria_area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion_tutor" (
    "id" SERIAL NOT NULL,
    "inscripcion_id" INTEGER NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "aprobado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_aprobacion" TIMESTAMP(3),
    "motivo_rechazo_id" INTEGER,
    "descripcion_rechazo" TEXT,
    "competidorId" TEXT,

    CONSTRAINT "Inscripcion_tutor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metodo_pago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Metodo_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estado_convocatoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "estado_convocatoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" SERIAL NOT NULL,
    "competidor_id" TEXT NOT NULL,
    "area_id" INTEGER NOT NULL,
    "convocatoria_id" INTEGER NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado_inscripcion" TEXT NOT NULL DEFAULT 'Pendiente',

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nivel" (
    "id" SERIAL NOT NULL,
    "nombre_nivel" TEXT NOT NULL,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motivo_rechazo" (
    "id" SERIAL NOT NULL,
    "mensaje" TEXT NOT NULL,

    CONSTRAINT "Motivo_rechazo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_nombre_key" ON "Permiso"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Competidor_usuario_id_key" ON "Competidor"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Competidor_carnet_identidad_key" ON "Competidor"("carnet_identidad");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_usuario_id_key" ON "Tutor"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_carnet_identidad_key" ON "Tutor"("carnet_identidad");

-- CreateIndex
CREATE UNIQUE INDEX "Tutor_numero_celular_key" ON "Tutor"("numero_celular");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_codigo_pago_key" ON "Pago"("codigo_pago");

-- CreateIndex
CREATE UNIQUE INDEX "Metodo_pago_nombre_key" ON "Metodo_pago"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "estado_convocatoria_nombre_key" ON "estado_convocatoria"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rol_permiso" ADD CONSTRAINT "Rol_permiso_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "Permiso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rol_permiso" ADD CONSTRAINT "Rol_permiso_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competidor" ADD CONSTRAINT "Competidor_colegio_id_fkey" FOREIGN KEY ("colegio_id") REFERENCES "Colegio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competidor" ADD CONSTRAINT "Competidor_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competidor" ADD CONSTRAINT "Competidor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tutor" ADD CONSTRAINT "Tutor_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colegio" ADD CONSTRAINT "Colegio_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "Provincia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Convocatoria" ADD CONSTRAINT "Convocatoria_id_estado_convocatoria_fkey" FOREIGN KEY ("id_estado_convocatoria") REFERENCES "estado_convocatoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_grado_max_id_fkey" FOREIGN KEY ("grado_max_id") REFERENCES "Grado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_grado_min_id_fkey" FOREIGN KEY ("grado_min_id") REFERENCES "Grado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grado" ADD CONSTRAINT "Grado_id_nivel_fkey" FOREIGN KEY ("id_nivel") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_metodo_pago_id_fkey" FOREIGN KEY ("metodo_pago_id") REFERENCES "Metodo_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area_convocatoria" ADD CONSTRAINT "Area_convocatoria_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area_convocatoria" ADD CONSTRAINT "Area_convocatoria_convocatoria_id_fkey" FOREIGN KEY ("convocatoria_id") REFERENCES "Convocatoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria_area" ADD CONSTRAINT "Categoria_area_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria_area" ADD CONSTRAINT "Categoria_area_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_tutor" ADD CONSTRAINT "Inscripcion_tutor_inscripcion_id_fkey" FOREIGN KEY ("inscripcion_id") REFERENCES "Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_tutor" ADD CONSTRAINT "Inscripcion_tutor_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "Tutor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_tutor" ADD CONSTRAINT "Inscripcion_tutor_competidorId_fkey" FOREIGN KEY ("competidorId") REFERENCES "Competidor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion_tutor" ADD CONSTRAINT "Inscripcion_tutor_motivo_rechazo_id_fkey" FOREIGN KEY ("motivo_rechazo_id") REFERENCES "Motivo_rechazo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_competidor_id_fkey" FOREIGN KEY ("competidor_id") REFERENCES "Competidor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_convocatoria_id_fkey" FOREIGN KEY ("convocatoria_id") REFERENCES "Convocatoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
