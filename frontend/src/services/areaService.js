import axios from 'axios';

const API_BASE_URL = 'http://localhost:7777'; // Cambia si tu backend está en otro lugar

export const getAreas = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/ver-areas`);
    return response.data;
};

export const crearArea = async ({ nombre, descripcion, costo }) => {
    const response = await axios.post(`${API_BASE_URL}/api/crear-area`, {
        nombre_area: nombre,
        descripcion_area: descripcion,
        costo
    });
    return response.data;
};
