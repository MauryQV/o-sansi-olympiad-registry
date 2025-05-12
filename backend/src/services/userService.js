import prisma from '../config/prismaClient.js';
import bcrypt from 'bcrypt';

/**
 * Servicio para manejar la lógica de negocio de usuarios
 * Centraliza las operaciones de acceso a datos y reglas de negocio
 */

/**
 * Obtiene todos los usuarios con información de roles
 * @returns {Promise<Array>} Lista de usuarios sin contraseñas
 */
export const findAllUsers = async () => {
  const usuarios = await prisma.usuario.findMany({
    include: {
      role: true
    }
  });

  // Transformar los datos para no enviar las contraseñas
  return usuarios.map(usuario => {
    const { password, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  });
};

/**
 * Busca un usuario por su ID
 * @param {string} id - ID del usuario
 * @returns {Promise<Object>} Usuario encontrado sin contraseña
 */
export const findUserById = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    include: {
      role: true,
      competidor: true,
      tutor: true
    }
  });

  if (!usuario) {
    return null;
  }

  // No enviar la contraseña
  const { password, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
};

/**
 * Verifica si un correo electrónico ya está en uso
 * @param {string} email - Correo electrónico a verificar
 * @param {string} userId - ID del usuario actual (para exclusión en actualizaciones)
 * @returns {Promise<boolean>} true si el correo está en uso
 */
export const isEmailInUse = async (email, userId = null) => {
  const query = {
    where: { 
      correo_electronico: {
        equals: email,
        mode: 'insensitive'
      }
    }
  };
  
  // Si estamos actualizando, excluimos el usuario actual
  if (userId) {
    query.where.id = { not: userId };
  }
  
  const existeCorreo = await prisma.usuario.findFirst(query);
  return !!existeCorreo;
};

/**
 * Verifica si un carnet de identidad ya está en uso
 * @param {string} carnet - Carnet de identidad a verificar
 * @returns {Promise<boolean>} true si el carnet está en uso
 */
export const isCarnetInUse = async (carnet) => {
  const existeCarnetCompetidor = await prisma.competidor.findFirst({
    where: { carnet_identidad: carnet }
  });

  const existeCarnetTutor = await prisma.tutor.findFirst({
    where: { carnet_identidad: carnet }
  });

  return !!(existeCarnetCompetidor || existeCarnetTutor);
};

/**
 * Crea un nuevo usuario
 * @param {Object} userData - Datos del usuario a crear
 * @returns {Promise<Object>} Usuario creado sin contraseña
 */
export const createNewUser = async (userData) => {
  const { 
    nombre, 
    apellido, 
    correo_electronico, 
    password, 
    rol_id, 
    carnet_identidad, 
    estado = true 
  } = userData;

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
      estado
    }
  });

  // No enviar la contraseña en la respuesta
  const { password: _, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
};

/**
 * Actualiza un usuario existente
 * @param {string} id - ID del usuario a actualizar
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} Usuario actualizado sin contraseña
 */
export const updateExistingUser = async (id, userData) => {
  const { 
    nombre, 
    apellido, 
    correo_electronico, 
    password, 
    rol_id, 
    estado 
  } = userData;

  // Preparar los datos para actualizar
  const datosActualizacion = {
    nombre,
    apellido,
    correo_electronico,
    rol_id: parseInt(rol_id),
    estado
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
  return usuarioSinPassword;
};

/**
 * Cambia el estado de un usuario (activo/inactivo)
 * @param {string} id - ID del usuario
 * @param {boolean} estado - Nuevo estado
 * @returns {Promise<Object>} Usuario actualizado sin contraseña
 */
export const changeUserState = async (id, estado) => {
  const usuarioActualizado = await prisma.usuario.update({
    where: { id },
    data: { estado: Boolean(estado) }
  });

  // No enviar la contraseña en la respuesta
  const { password, ...usuarioSinPassword } = usuarioActualizado;
  return usuarioSinPassword;
};

/**
 * Elimina un usuario
 * @param {string} id - ID del usuario a eliminar
 * @returns {Promise<void>}
 */
export const removeUser = async (id) => {
  await prisma.usuario.delete({
    where: { id }
  });
};

/**
 * Obtiene todos los roles disponibles
 * @returns {Promise<Array>} Lista de roles
 */
export const findAllRoles = async () => {
  return await prisma.rol.findMany();
};

export default {
  findAllUsers,
  findUserById,
  isEmailInUse,
  isCarnetInUse,
  createNewUser,
  updateExistingUser,
  changeUserState,
  removeUser,
  findAllRoles
}; 