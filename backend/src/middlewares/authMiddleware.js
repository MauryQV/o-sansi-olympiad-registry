import supabase from "../config/supabaseClient.js";
import jwt from "jsonwebtoken";
import { validarToken } from '../utils/jwtUtils.js';
import prisma from '../config/prismaClient.js';

const JWT_SECRET = process.env.JWT_SECRET;


export const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(403).json({ error: "Acceso denegado" });

    const { data, error } = await supabase.auth.getUser(token);

    if (error) return res.status(401).json({ error: "Token inválido" });

    req.user = data.user;
    next();
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
