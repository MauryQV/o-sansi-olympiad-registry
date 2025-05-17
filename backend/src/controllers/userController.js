import userService from '../services/userService.js';

/**
 * Controlador para la gestión de usuarios
 * Define las funciones que responden a las peticiones de la API
 */

/**
 * Obtiene todos los usuarios
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
export const getUsers = async (req, res) => {
  try {
    const usuarios = await userService.findAllUsers();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};

/**
 * Obtiene un usuario por su ID
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await userService.findUserById(id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
};

/**
 * Crea un nuevo usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
export const createUser = async (req, res) => {
  const { 
    nombre, 
    apellido, 
    correo_electronico, 
    password, 
    rol_id, 
    carnet_identidad, 
    estado = true 
  } = req.body;

  // Validar los campos requeridos
  if (!nombre || !apellido || !correo_electronico || !password || !rol_id || !carnet_identidad) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si el correo ya existe
    const existeCorreo = await userService.isEmailInUse(correo_electronico);
    if (existeCorreo) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Verificar si ya existe un usuario con ese carnet
    const existeCarnet = await userService.isCarnetInUse(carnet_identidad);
    if (existeCarnet) {
      return res.status(400).json({ error: 'El carnet de identidad ya está registrado' });
    }

    // Crear el usuario
    const usuario = await userService.createNewUser({
      nombre,
      apellido,
      correo_electronico,
      password,
      rol_id,
      carnet_identidad,
      estado
    });
    
    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

/**
 * Actualiza un usuario existente
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { 
    nombre, 
    apellido, 
    correo_electronico, 
    password, 
    rol_id, 
    estado 
  } = req.body;

  // Validar los campos requeridos (excepto la contraseña que puede no actualizarse)
  if (!nombre || !apellido || !correo_electronico || !rol_id) {
    return res.status(400).json({ error: 'Los campos nombre, apellido, correo y rol son requeridos' });
  }

  try {
    // Verificar que el usuario existe
    const usuarioExistente = await userService.findUserById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar que el correo no esté en uso por otro usuario
    const existeCorreo = await userService.isEmailInUse(correo_electronico, id);
    if (existeCorreo) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado por otro usuario' });
    }

    // Actualizar el usuario
    const usuarioActualizado = await userService.updateExistingUser(id, {
      nombre,
      apellido,
      correo_electronico,
      password,
      rol_id,
      estado
    });
    
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};

/**
 * Cambia el estado de un usuario (activo/inactivo)
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
export const changeUserStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (estado === undefined) {
    return res.status(400).json({ error: 'El estado es requerido' });
  }

  try {
    // Verificar que el usuario existe
    const usuarioExistente = await userService.findUserById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Cambiar el estado del usuario
    const usuarioActualizado = await userService.changeUserState(id, estado);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
  }
};

/**
 * Elimina un usuario
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar que el usuario existe
    const usuarioExistente = await userService.findUserById(id);
    if (!usuarioExistente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Eliminar el usuario
    await userService.removeUser(id);
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

/**
 * Obtiene todos los roles disponibles
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 */
export const getRoles = async (req, res) => {
  try {
    const roles = await userService.findAllRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ error: 'Error al obtener los roles' });
  }
}; 