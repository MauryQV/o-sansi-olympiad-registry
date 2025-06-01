// validaciones/convocatoriaValidaciones.js

// Configuración de validaciones
export const VALIDACIONES_CONFIG = {
    nombre: { max: 100, required: true, label: 'Nombre' },
    descripcion: { max: 1000, required: true, label: 'Descripción' },
    inscripcionInicio: { required: true, label: 'Fecha inicio inscripción' },
    inscripcionFin: { required: true, label: 'Fecha fin inscripción' },
    pagoInicio: { required: true, label: 'Inicio del periodo de pago' },
    pagoFin: { required: true, label: 'Fin del periodo de pago' },
    competenciaInicio: { required: true, label: 'Fecha inicio competencia' },
    competenciaFin: { required: true, label: 'Fecha fin competencia' },
    id_estado_convocatoria: { required: true, label: 'Estado' },
    areasSeleccionadas: { required: true, label: 'Áreas de competencia', min: 1 }
};

// Mensajes de error
export const MENSAJES_ERROR = {
    campoObligatorio: (label) => `${label} es obligatorio`,
    seleccionObligatoria: (label) => `Seleccione un ${label.toLowerCase()}`,
    longitudMaxima: (max) => `Máximo ${max} caracteres`,
    seleccionMinima: (min, label) => `Selecciona al menos ${min} ${label.toLowerCase()}`,
    fechaPasada: 'Debe ser igual o posterior a hoy',
    fechaAnterior: (referencia) => `Debe ser después de ${referencia}`,
    fechas: {
        inscripcionFin: 'Debe ser después de la fecha de inicio de inscripción',
        pagoInicio: 'El inicio de pago debe ser después del fin de inscripción',
        pagoFin: 'Debe ser posterior al inicio de pago',
        competenciaInicio: 'El inicio de competencia debe ser después del fin de pago',
        competenciaFin: 'Debe ser después del inicio de competencia'
    }
};

// Validador de campos obligatorios
export const validarCamposObligatorios = (formulario) => {
    const errores = {};

    Object.entries(VALIDACIONES_CONFIG).forEach(([campo, config]) => {
        if (!config.required) return;

        const valor = formulario[campo];
        let estaVacio = false;

        switch (campo) {
            case 'areasSeleccionadas':
                estaVacio = !valor || valor.length === 0;
                if (estaVacio) {
                    errores[campo] = MENSAJES_ERROR.seleccionMinima(config.min, config.label);
                }
                break;
            case 'id_estado_convocatoria':
                estaVacio = !valor;
                if (estaVacio) {
                    errores[campo] = MENSAJES_ERROR.seleccionObligatoria(config.label);
                }
                break;
            default:
                estaVacio = !valor || !valor.toString().trim();
                if (estaVacio) {
                    errores[campo] = MENSAJES_ERROR.campoObligatorio(config.label);
                }
        }
    });

    return errores;
};

// Validador de longitud de texto
export const validarLongitudTexto = (formulario) => {
    const errores = {};

    Object.entries(VALIDACIONES_CONFIG).forEach(([campo, config]) => {
        if (!config.max || !formulario[campo]) return;

        if (formulario[campo].length > config.max) {
            errores[campo] = MENSAJES_ERROR.longitudMaxima(config.max);
        }
    });

    return errores;
};

// Validador de fechas
export const validarFechas = (formulario) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const errores = {};

    const parsearFecha = (fecha) => fecha ? new Date(fecha) : null;

    const fechas = {
        inscripcionInicio: parsearFecha(formulario.inscripcionInicio),
        inscripcionFin: parsearFecha(formulario.inscripcionFin),
        pagoInicio: parsearFecha(formulario.pagoInicio),
        pagoFin: parsearFecha(formulario.pagoFin),
        competenciaInicio: parsearFecha(formulario.competenciaInicio),
        competenciaFin: parsearFecha(formulario.competenciaFin)
    };

    // Validar que inscripción inicio no sea anterior a hoy
    if (fechas.inscripcionInicio && fechas.inscripcionInicio < hoy) {
        errores.inscripcionInicio = MENSAJES_ERROR.fechaPasada;
    }

    // Validar secuencia de fechas
    const validacionesFechas = [
        {
            campo: 'inscripcionFin',
            fecha: fechas.inscripcionFin,
            referencia: fechas.inscripcionInicio,
            mensaje: MENSAJES_ERROR.fechas.inscripcionFin
        },
        {
            campo: 'pagoInicio',
            fecha: fechas.pagoInicio,
            referencia: fechas.inscripcionFin,
            mensaje: MENSAJES_ERROR.fechas.pagoInicio
        },
        {
            campo: 'pagoFin',
            fecha: fechas.pagoFin,
            referencia: fechas.pagoInicio,
            mensaje: MENSAJES_ERROR.fechas.pagoFin
        },
        {
            campo: 'competenciaInicio',
            fecha: fechas.competenciaInicio,
            referencia: fechas.pagoFin,
            mensaje: MENSAJES_ERROR.fechas.competenciaInicio
        },
        {
            campo: 'competenciaFin',
            fecha: fechas.competenciaFin,
            referencia: fechas.competenciaInicio,
            mensaje: MENSAJES_ERROR.fechas.competenciaFin
        }
    ];

    validacionesFechas.forEach(({ campo, fecha, referencia, mensaje }) => {
        if (fecha && referencia && fecha <= referencia) {
            errores[campo] = mensaje;
        }
    });

    return errores;
};

// Validador completo del formulario
export const validarFormularioCompleto = (formulario) => {
    const erroresCampos = validarCamposObligatorios(formulario);
    const erroresLongitud = validarLongitudTexto(formulario);
    const erroresFechas = validarFechas(formulario);

    return {
        ...erroresCampos,
        ...erroresLongitud,
        ...erroresFechas
    };
};

// Validar en tiempo real (solo longitud y fechas)
export const validarEnTiempoReal = (formulario, campo, valor) => {
    const formularioActualizado = { ...formulario, [campo]: valor };
    const errores = {};

    // Validar longitud si aplica
    const configCampo = VALIDACIONES_CONFIG[campo];
    if (configCampo?.max && valor && valor.length > configCampo.max) {
        errores[campo] = MENSAJES_ERROR.longitudMaxima(configCampo.max);
    }

    // Validar fechas cruzadas
    const erroresFechas = validarFechas(formularioActualizado);

    return { ...errores, ...erroresFechas };
};

// Verificar si hay errores en el estado actual
export const tieneErrores = (errores) => {
    return Object.keys(errores).some(key => errores[key] && errores[key].trim() !== '');
};