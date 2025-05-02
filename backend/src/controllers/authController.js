import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generarToken } from '../utils/jwtUtils.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_desarrollo';

export const login = async (req, res) => {
    const { correo_electronico, password } = req.body;

    if (!correo_electronico || !password) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
    }

    try {
        console.log("Buscando usuario con email:", correo_electronico);

        // Buscar el usuario por correo
        const usuarios = await prisma.usuario.findMany({
            where: { 
                correo_electronico: {
                    equals: correo_electronico,
                    mode: 'insensitive'
                }
            }
        });

        console.log(`Encontrados ${usuarios.length} usuarios`);
        
        if (usuarios.length === 0) {
            console.log("Usuario no encontrado");
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const usuario = usuarios[0];
        console.log("Usuario encontrado:", usuario.id);
        console.log("Password almacenado (hash):", usuario.password);
        
        // Verificar si la contraseña está hasheada
        const esHash = usuario.password.startsWith('$2');
        console.log("¿La contraseña parece ser un hash bcrypt?:", esHash);
        
        if (!esHash) {
            // Si no está hasheada, podemos intentar compararla directamente (para pruebas)
            if (password === usuario.password) {
                console.log("Comparación directa de contraseña exitosa");
                
                // Generar token
                const token = generarToken({
                    id: usuario.id,
                    rol_id: usuario.rol_id,
                    correo_electronico: usuario.correo_electronico,
                });

                // Responder con el token y datos del usuario
                return res.json({
                    token,
                    usuario: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        correo: usuario.correo_electronico,
                        rol_id: usuario.rol_id,
                    },
                });
            } else {
                console.log("Comparación directa de contraseña fallida");
                return res.status(401).json({ error: 'Credenciales inválidas (contraseña no hasheada)' });
            }
        }

        // Verificar la contraseña con bcrypt
        try {
            const passwordValida = await bcrypt.compare(password, usuario.password);
            console.log("Resultado de bcrypt.compare:", passwordValida);
            
            if (!passwordValida) {
                console.log("Contraseña inválida");
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }

            // Generar token
            const token = generarToken({
                id: usuario.id,
                rol_id: usuario.rol_id,
                correo_electronico: usuario.correo_electronico,
            });

            // Responder con el token y datos del usuario
            res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    correo: usuario.correo_electronico,
                    rol_id: usuario.rol_id,
                },
            });
        } catch (bcryptError) {
            console.error("Error en bcrypt.compare:", bcryptError);
            return res.status(500).json({ error: 'Error al verificar contraseña' });
        }
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
