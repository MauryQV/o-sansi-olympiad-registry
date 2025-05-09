import axios from 'axios';

// Configuración base para axios
const API_BASE_URL = 'http://localhost:7777/api';

// Crear instancia de axios con configuración común
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const loginUsuario = async ({ correo, contraseña }) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            correo_electronico: correo,
            password: contraseña,
        }),
    });

    if (!response.ok) {
        throw new Error("Login fallido");
    }

    return await response.json();
};

// Interceptor para añadir token de autorización a las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores comunes de respuesta
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejar errores de autorización (401)
        if (error.response && error.response.status === 401) {
            // Limpiar datos de sesión
            localStorage.removeItem('token');
            localStorage.removeItem('userData');

            // Aquí podrías redirigir al login si lo deseas
            // window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default api;