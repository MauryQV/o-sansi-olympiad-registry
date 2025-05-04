import supabase from "../config/supabaseClient.js";
import jwt from "jsonwebtoken";
import { validarToken } from '../utils/jwtUtils.js';

const JWT_SECRET = process.env.JWT_SECRET;


export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Agregamos el usuario decodificado al request
    req.user = {
      id: decoded.id,           // Asegúrate que el token tiene el ID del usuario
      rol: decoded.rol || null  // Puedes agregar más campos si querés
    };

    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};


/**
 * Middleware para verificar si el token JWT es válido
 */
export const verificarToken = (req, res, next) => {
  // Obtener el token del encabezado
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token de autenticación' });
  }

  // Validar el token
  const usuario = validarToken(token);

  if (!usuario) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  // Guardar el usuario en la solicitud para uso posterior
  req.usuario = usuario;
  next();
};
