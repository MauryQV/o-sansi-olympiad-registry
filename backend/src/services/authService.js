// authService.js básico para evitar error de módulo no encontrado
export const login = async () => {
  // Implementación simulada
  return { token: "fake-token" };
};

export const register = async () => {
  // Implementación simulada
  return { success: true };
};

// Puedes agregar más funciones simuladas si el controlador las requiere

// Implementaciones simuladas para evitar errores de importación
export const loginUser = async () => {
  return { token: "fake-token" };
};

export const registerUser = async () => {
  return { success: true };
};

export const logoutUser = async () => {
  return { success: true };
};