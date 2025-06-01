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
    //console.error('Error al verificar token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
};


/**
 * Middleware para verificar si el token JWT es válido
 */
export const verificarToken = (req, res, next) => {
  try {
    // Obtener el token del encabezado
    const token = req.headers.authorization;
    //console.log('Headers recibidos:', req.headers);
    //console.log('Token recibido:', token ? `${token.substring(0, 20)}...` : 'No hay token');
    //Muchos console logs que no tienen sentido, pero los dejo por si acaso
    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token de autenticación' });
    }

    const usuario = validarToken(token);

    if (!usuario) {
      // console.log('Token inválido o expirado');
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    //console.log('Usuario autenticado:', usuario);
    req.usuario = usuario;
    next();
  } catch (error) {
    ///console.error('Error en verificarToken:', error);
    return res.status(500).json({ error: 'Error interno del servidor al verificar token' });
  }
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
