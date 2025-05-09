import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            include: {
                role: true
            }
        });

        // Transformar los datos para no enviar las contraseñas
        const usuariosSinPassword = usuarios.map(usuario => {
            const { password, ...usuarioSinPassword } = usuario;
            return usuarioSinPassword;
        });

        res.json(usuariosSinPassword);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
            include: {
                role: true,
                competidor: true,
                tutor: true
            }
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // No enviar la contraseña
        const { password, ...usuarioSinPassword } = usuario;
        res.json(usuarioSinPassword);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    const { 
        nombre, 
        apellido, 
        correo_electronico, 
        password, 
        rol_id, 
        telefono, 
        carnet_identidad, 
        estado = true 
    } = req.body;

    // Validar los campos requeridos
    if (!nombre || !apellido || !correo_electronico || !password || !rol_id || !carnet_identidad) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        // Verificar si el correo ya existe
        const existeCorreo = await prisma.usuario.findFirst({
            where: { 
                correo_electronico: {
                    equals: correo_electronico,
                    mode: 'insensitive'
                }
            }
        });

        if (existeCorreo) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Verificar si ya existe un usuario con ese carnet (puede estar en competidor o tutor)
        const existeCarnetCompetidor = await prisma.competidor.findFirst({
            where: { carnet_identidad }
        });

        const existeCarnetTutor = await prisma.tutor.findFirst({
            where: { carnet_identidad }
        });

        if (existeCarnetCompetidor || existeCarnetTutor) {
            return res.status(400).json({ error: 'El carnet de identidad ya está registrado' });
        }

        // Hashear la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear el usuario
        const usuario = await prisma.usuario.create({
            data: {
                nombre,
                apellido,
                correo_electronico,
                password: hashedPassword,
                rol_id: parseInt(rol_id),
            }
        });

        // No enviar la contraseña en la respuesta
        const { password: _, ...usuarioSinPassword } = usuario;
        res.status(201).json(usuarioSinPassword);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { 
        nombre, 
        apellido, 
        correo_electronico, 
        password, 
        rol_id, 
        telefono, 
        carnet_identidad, 
        estado 
    } = req.body;

    // Validar los campos requeridos (excepto la contraseña que puede no actualizarse)
    if (!nombre || !apellido || !correo_electronico || !rol_id) {
        return res.status(400).json({ error: 'Los campos nombre, apellido, correo y rol son requeridos' });
    }

    try {
        // Verificar que el usuario existe
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id }
        });

        if (!usuarioExistente) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar que el correo no esté en uso por otro usuario
        const existeCorreo = await prisma.usuario.findFirst({
            where: { 
                correo_electronico: {
                    equals: correo_electronico,
                    mode: 'insensitive'
                },
                id: {
                    not: id
                }
            }
        });

        if (existeCorreo) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado por otro usuario' });
        }

        // Preparar los datos para actualizar
        const datosActualizacion = {
            nombre,
            apellido,
            correo_electronico,
            rol_id: parseInt(rol_id),
        };

        // Si se proporciona una nueva contraseña, la hasheamos
        if (password) {
            const saltRounds = 10;
            datosActualizacion.password = await bcrypt.hash(password, saltRounds);
        }

        // Actualizar el usuario
        const usuarioActualizado = await prisma.usuario.update({
            where: { id },
            data: datosActualizacion
        });

        // No enviar la contraseña en la respuesta
        const { password: _, ...usuarioSinPassword } = usuarioActualizado;
        res.json(usuarioSinPassword);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};

// Cambiar el estado del usuario (activar/desactivar)
export const changeUserStatus = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (estado === undefined) {
        return res.status(400).json({ error: 'El estado es requerido' });
    }

    try {
        // Verificar que el usuario existe
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id }
        });

        if (!usuarioExistente) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar el estado del usuario (aquí asumimos que agregaremos un campo "estado" al modelo Usuario)
        // Primero, necesitaremos modificar el esquema Prisma para agregar este campo
        const usuarioActualizado = await prisma.usuario.update({
            where: { id },
            data: {
                estado: Boolean(estado)
            }
        });

        // No enviar la contraseña en la respuesta
        const { password, ...usuarioSinPassword } = usuarioActualizado;
        res.json(usuarioSinPassword);
    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar que el usuario existe
        const usuarioExistente = await prisma.usuario.findUnique({
            where: { id }
        });

        if (!usuarioExistente) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Eliminar el usuario
        await prisma.usuario.delete({
            where: { id }
        });

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        
        // Si el error es de relaciones, enviar un mensaje más amigable
        if (error.code === 'P2003' || error.code === 'P2014') {
            return res.status(400).json({ 
                error: 'No se puede eliminar el usuario porque tiene registros relacionados. Considere desactivarlo en su lugar.' 
            });
        }
        
        res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
};

// Obtener roles disponibles
export const getRoles = async (req, res) => {
    try {
        const roles = await prisma.rol.findMany();
        res.json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ error: 'Error al obtener los roles' });
    }
}; 