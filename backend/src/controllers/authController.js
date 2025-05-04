import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import { generarToken } from '../utils/jwtUtils.js';

//const JWT_SECRET = process.env.JWT_SECRET || 'secreto_desarrollo';

/**
 * Controlador para iniciar sesión de usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} Respuesta JSON con token y datos del usuario
 */
export const login = async (req, res) => {
    try {

        const { correo_electronico, password } = req.body;

        if (!correo_electronico || !password) {
            return res.status(400).json({
                error: 'Debe proporcionar correo electrónico y contraseña'
            });
        }

        // Buscar el usuario por correo (case insensitive para mayor flexibilidad)
        const usuario = await prisma.usuario.findFirst({
            where: {
                correo_electronico: {
                    equals: correo_electronico,
                    mode: 'insensitive'
                }
            }
        });

        // Mensaje genérico para no revelar si el usuario existe o no
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // En desarrollo: comparación directa de contraseña (temporal)
        // TODO: Implementar cifrado de contraseñas en producción
        const passwordValida = password === usuario.password;

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }

        // Datos para el payload del token
        const tokenPayload = {
            id: usuario.id,
            rol_id: usuario.rol_id,
            correo_electronico: usuario.correo_electronico
        };

        // Generar token JWT
        const token = generarToken(tokenPayload);

        // Responder con el token y datos básicos del usuario
        return res.status(200).json({
            success: true,
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo_electronico,
                rol_id: usuario.rol_id
            }
        });
    } catch (error) {
        console.error('Error en el proceso de login:', error);
        return res.status(500).json({
            error: 'Error interno del servidor',
            mensaje: 'Ocurrió un problema durante la autenticación'
        });
    }
};
