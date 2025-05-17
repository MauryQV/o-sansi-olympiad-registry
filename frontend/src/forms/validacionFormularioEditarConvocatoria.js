// forms/validacionFormularioConvocatoria.js
export const validarFormulario = (formulario) => {
    const errores = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (!formulario.nombre.trim()) errores.nombre = 'Nombre obligatorio';
    if (!formulario.descripcion.trim()) errores.descripcion = 'Descripción obligatoria';
    if (!formulario.inscripcionInicio) errores.inscripcionInicio = 'Fecha inicio inscripción obligatoria';
    if (!formulario.inscripcionFin) errores.inscripcionFin = 'Fecha fin inscripción obligatoria';
    if (!formulario.pagoInicio) errores.pagoInicio = 'Ingrese el inicio del periodo de pago.';
    if (!formulario.pagoFin) errores.pagoFin = 'Ingrese el fin del periodo de pago.';
    if (!formulario.competenciaInicio) errores.competenciaInicio = 'Fecha inicio competencia obligatoria';
    if (!formulario.competenciaFin) errores.competenciaFin = 'Fecha fin competencia obligatoria';
    if (!formulario.id_estado_convocatoria) errores.id_estado_convocatoria = 'Seleccione un estado';
    if (!formulario.areasSeleccionadas.length) errores.areasSeleccionadas = 'Selecciona al menos un área';

    const fechas = {
        inscripcionInicio: new Date(formulario.inscripcionInicio),
        inscripcionFin: new Date(formulario.inscripcionFin),
        pagoInicio: new Date(formulario.pagoInicio),
        pagoFin: new Date(formulario.pagoFin),
        competenciaInicio: new Date(formulario.competenciaInicio),
        competenciaFin: new Date(formulario.competenciaFin)
    };

    if (fechas.inscripcionFin <= fechas.inscripcionInicio) {
        errores.inscripcionFin = 'La fecha fin debe ser posterior a la fecha inicio';
    }
    if (fechas.pagoFin <= fechas.pagoInicio) {
        errores.pagoFin = 'La fecha fin debe ser posterior a la fecha inicio';
    }
    if (fechas.competenciaFin <= fechas.competenciaInicio) {
        errores.competenciaFin = 'La fecha fin debe ser posterior a la fecha inicio';
    }

    return errores;
};
