import jwt from "jsonwebtoken";
import { validarToken } from '../utils/jwtUtils.js';
import prisma from '../config/prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET;


export const authMiddleware = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);


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
  //console.log('Token recibido:', token);//debuggggggggggggggggggggggggggggggg
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporciono token de autenticación' });
  }

  const usuario = validarToken(token);

  if (!usuario) {
    return res.status(401).json({ error: 'Token invalido o expirado' });
  }

  req.usuario = usuario;
  next();
};

/**
 * Middleware para verificar si el usuario es administrador
 */
export const verificarAdmin = async (req, res, next) => {
  try {
    const usuarioId = req.usuario.id;

    // Obtener el rol del usuario
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: { role: true }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar si el rol es de administrador (asumimos que el rol con id 1 es administrador)
    // Esta lógica puede cambiar según la estructura de roles en tu aplicación
    if (usuario.role.nombre !== 'Administrador' && usuario.rol_id !== 1) {
      return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador' });
    }

    next();
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
