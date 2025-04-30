import axios from 'axios';

const API_BASE_URL = 'http://localhost:7777/api'; // Cambia si tu backend está en otro lugar

export const getAreas = async () => {
    const response = await axios.get(`${API_BASE_URL}/ver-areas`);
    return response.data;
};

export const crearArea = async ({ nombre, descripcion, costo }) => {
    const response = await axios.post(`${API_BASE_URL}/crear-area`, {
        nombre_area: nombre,
        descripcion_area: descripcion,
        costo
    });
    return response.data;
};

export const eliminarArea = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/eliminar-area/${id}`);
    return response.data;
}

export const actualizarArea = async (id, { nombre, descripcion, costo }) => {
    const response = await axios.patch(`${API_BASE_URL}/actualizar-area/${id}`, {
        nombre_area: nombre,
        descripcion_area: descripcion,
        costo
    });
    return response.data;
};

export const getAreaById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/ver-area/${id}`);
    return response.data;
}
