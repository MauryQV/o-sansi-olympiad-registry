export const validarFechasDePago = (convocatoria) => {
    const ahora = new Date();
    const inicio = new Date(convocatoria.pago_inicio);
    const fin = new Date(convocatoria.pago_fin);

    if (ahora < inicio) {
        const error = new Error('Aún no está habilitado el período de pagos.');
        error.codigo = 'PAGO_NO_INICIADO';
        throw error;
    }

    if (ahora > fin) {
        const error = new Error('El período de pagos ya ha finalizado.');
        error.codigo = 'PAGO_FINALIZADO';
        throw error;
    }
};