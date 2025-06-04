import * as pagoService from '../services/pagoService.js';
import { obtenerPagosCompetidorService } from '../services/pagoService.js';
import { io, connectedUsers } from '../index.js';

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
        const resultado = await pagoService.validarPago(pago_id, io, connectedUsers);
        res.status(200).json({
            success: true,
            message: resultado.mensaje,
            pago: resultado.pago
        });
    } catch (error) {
        console.error('Error al validar pago:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error al validar el pago'
        });
    }
}


//funcion para el competidor para ver sus pagos pendientes
export const verMisPagosPendientes = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        //console.log('ID del usuario:', usuarioId);
        const competidor = await pagoService.obtenerIdCompetidor(usuarioId);
        //console.log('ID del competidor:', competidor || 'No se encontró competidor para el usuario controler');
        if (!competidor) {
            return res.status(404).json({ error: 'Competidor no encontrado para este usuario.' });
        }

        const pagosPendientes = await pagoService.verMisPagosPendientes(competidor);

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
            return res.status(400).json({ error: 'El ID del pago debe ser un numero valido.' });
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

export const obtenerPagosCompetidor = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            //console.error('No se encontró el usuario en la request');
            return res.status(401).json({
                message: 'No autorizado',
                error: 'Usuario no autenticado'
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        //console.log('Obteniendo pagos del competidor. User ID:', req.user.id);

        const resultado = await obtenerPagosCompetidorService(req.user.id, page, limit);
        console.log('Pagos encontrados:', JSON.stringify(resultado, null, 2));

        res.json(resultado);
    } catch (error) {
        console.error('Error en obtenerPagosCompetidor:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            message: 'Error al obtener los pagos',
            error: error.message
        });
    }
};

export const obtenerPagosRealizados = async (req, res) => {
    try {
        const pagosRealizados = await pagoService.obtenerPagosRealizados();
        res.status(200).json(pagosRealizados);
    } catch (error) {
        console.error('Error al obtener pagos realizados:', error);
        res.status(500).json({ error: error.message });
    }
};

export const obtenerEstadisticasPagos = async (req, res) => {
    try {
        const estadisticas = await pagoService.obtenerEstadisticasPagos();
        res.status(200).json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas de pagos:', error);
        res.status(500).json({ error: error.message });
    }
};