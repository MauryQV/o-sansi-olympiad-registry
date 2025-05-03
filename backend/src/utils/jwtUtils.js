import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_desarrollo';

/**
 * Genera un token JWT
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} - Token JWT generado
 */
export const generarToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Valida un token JWT
 * @param {string} token - Token JWT a validar
 * @returns {Object|null} - Datos del token si es válido, null si no
 */
export const validarToken = (token) => {
  if (!token) return null;

  try {
    // Eliminar prefijo "Bearer " si existe
    const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
    return jwt.verify(tokenLimpio, JWT_SECRET);
  } catch (error) {
    console.error('Error al validar token:', error.message);
    return null;
  }
}; 