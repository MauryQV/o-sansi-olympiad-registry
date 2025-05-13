import * as pagoService from '../services/pagoService.js';

//funcion para el cajero para ver todos los pagos pendientes
//creo que queda un poco redundante, pero es para que el cajero pueda ver todos los pagos pendientes
export const obtenerPagosPendientes = async (req, res) => {

    try {
        const pagosPendientes = await pagoService.obtenerPagosPendientes();
        res.status(200).json(pagosPendientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


//funcion del cajero para validar un pago
export const validarPago = async (req, res) => {

    const pago_id = parseInt(req.params.pagoId);
    try {
        const pagoValidado = await pagoService.validarPago(pago_id);
        res.status(200).json({
            status: "success",
            message: "Pago validado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            status: "error",
        });
    }
}


//funcion para el competidor para ver sus pagos pendientes
export const verMisPagosPendientes = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const competidor = pagoService.obtenerIdCompetidor(usuarioId);
        if (!competidor) {
            return res.status(404).json({ error: 'Competidor no encontrado para este usuario.' });
        }

        const pagosPendientes = await pagoService.verMisPagosPendientes(competidor.id);

        res.status(200).json(pagosPendientes);
    } catch (error) {
        console.error('Error al obtener pagos pendientes:', error);
        res.status(500).json({ error: error.message });
    }
};

//funcion para ver el detalle de un pago
export const verDetallePago = async (req, res) => {
    try {
        const pagoId = parseInt(req.params.pagoId); // obtener el id del pago 

        if (isNaN(pagoId)) {
            return res.status(400).json({ error: 'El ID del pago debe ser un número válido.' });
        }

        const detallePago = await pagoService.verDetallePago(pagoId);
        res.status(200).json(detallePago);
    } catch (error) {
        console.error('Error al obtener el detalle del pago:', error);
        res.status(500).json({ error: error.message });
    }
};

//funcion para buscar pagos por tipo y valor: carnet, nombre, codigo de boleta
export const buscarPagos = async (req, res) => {
    try {
        const { tipo, valor } = req.query;

        if (!tipo || !valor) {
            return res.status(400).json({ error: 'No se proporciono un tipo o un valor' });
        }

        const resultados = await pagoService.buscarPagos({ tipo, valor });

        res.status(200).json(resultados); //devolvemos los resultados
    } catch (error) {
        console.error('Error al buscar pagos:', error);
        res.status(500).json({ error: error.message });
    }
};