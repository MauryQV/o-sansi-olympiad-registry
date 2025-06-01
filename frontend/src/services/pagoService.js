import axios from 'axios';
import { API_URL, API_TIMEOUT } from './apiConfig';
import apiAuth from '../api/api'; //instancia con token de autenticacion

// Configurar axios con la URL y timeout por defecto
const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT
});


export const verMisPagosPendientes = async () => {
    try {
        const response = await apiAuth.get(`/pagos/mis-pagos-pendientes`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los pagos pendientes:', error);
        throw error;
    }
}

export const verDetallePago = async (pagoId) => {
    try {
        const response = await apiAuth.get(`/pagos/competidor/detalle/${pagoId}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el detalle del pago:', error);
        throw error;
    }
}



