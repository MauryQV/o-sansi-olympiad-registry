import axios from 'axios';

const API_BASE_URL = 'http://localhost:7777'; // Ajusta si es necesario

export const getEstadosConvocatoria = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/convocatoria-estados`);
    return response.data;
};