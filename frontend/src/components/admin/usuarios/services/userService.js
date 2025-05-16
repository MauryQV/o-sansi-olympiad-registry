import axios from "axios";

/**
 * Servicio para la gestión de usuarios
 * Centraliza todas las llamadas a la API relacionadas con usuarios
 */

// URL base de la API
// En producción, se debería usar environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7777/api";

/**
 * Obtiene la configuración de autorización para las peticiones
 * @returns {Object} Configuración de headers con el token
 */
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token,
    },
  };
};

/**
 * Obtiene todos los usuarios
 * @returns {Promise} Lista de usuarios
 */
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/usuarios`, getAuthConfig());
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Error al obtener usuarios");
  }
};

/**
 * Obtiene todos los roles disponibles
 * @returns {Promise} Lista de roles
 */
export const getAllRoles = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/usuarios/roles`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Error al obtener roles");
  }
};

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario a crear
 * @returns {Promise} Usuario creado
 */
export const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/usuarios`,
      userData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Error al crear usuario");
  }
};

/**
 * Actualiza un usuario existente
 * @param {string} userId - ID del usuario
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise} Usuario actualizado
 */
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/usuarios/${userId}`,
      userData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Error al actualizar usuario");
  }
};

/**
 * Cambia el estado de un usuario (activo/inactivo)
 * @param {string} userId - ID del usuario
 * @param {boolean} newStatus - Nuevo estado
 * @returns {Promise} Usuario actualizado
 */
export const changeUserStatus = async (userId, newStatus) => {
  try {
    const response = await axios.patch(
      `${API_URL}/usuarios/${userId}/status`,
      { estado: newStatus },
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Error al cambiar estado del usuario");
  }
};

/**
 * Elimina un usuario
 * @param {string} userId - ID del usuario
 * @returns {Promise} Mensaje de confirmación
 */
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/usuarios/${userId}`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Error al eliminar usuario");
  }
};

/**
 * Procesa los errores de la API para un mejor manejo en la UI
 * @param {Error} error - Error original
 * @param {string} defaultMessage - Mensaje por defecto
 * @returns {Error} Error procesado
 */
const handleApiError = (error, defaultMessage) => {
  // Si tenemos respuesta de error de la API, usamos ese mensaje
  if (error.response && error.response.data) {
    const { data } = error.response;
    const message = data.error || (typeof data === "string" ? data : JSON.stringify(data));
    return new Error(message);
  }
  
  // Si es un error de conexión o timeout
  if (error.code === "ECONNABORTED") {
    return new Error("La solicitud tardó demasiado tiempo en completarse");
  }
  
  // Para otros errores, usamos el mensaje por defecto
  return new Error(defaultMessage);
};

export default {
  getAllUsers,
  getAllRoles,
  createUser,
  updateUser,
  changeUserStatus,
  deleteUser,
}; 