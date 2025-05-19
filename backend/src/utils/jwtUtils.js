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
  if (!token) {
    console.log('Token no proporcionado');
    return null;
  }

  try {
    // Eliminar prefijo "Bearer " si existe
    console.log('Token recibido para validar:', token.substring(0, 20) + '...');
    const tokenLimpio = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(tokenLimpio, JWT_SECRET);
    console.log('Token validado correctamente, payload:', JSON.stringify(decoded, null, 2));
    return decoded;
  } catch (error) {
    console.error('Error al validar token:', error.message);
    if (error.name === 'TokenExpiredError') {
      console.log('El token ha expirado');
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Token JWT inválido');
    }
    return null;
  }
}; 