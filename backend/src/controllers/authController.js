import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET

export const login = async (req, res) => {
    const { correo_electronico, password } = req.body;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { correo_electronico },
        });

        if (!usuario || !usuario.password) {
            return res.status(401).json({ error: 'Correo o contraseña inválidos' });
        }

        const validPassword = await bcrypt.compare(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Correo o contraseña inválidos' });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: usuario.id,
                rol_id: usuario.rol_id,
                correo_electronico: usuario.correo_electronico,
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

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
    } catch (err) {
        console.error('Error en login:', err.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
