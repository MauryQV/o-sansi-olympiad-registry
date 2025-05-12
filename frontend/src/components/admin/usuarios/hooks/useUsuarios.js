import { useState, useEffect, useCallback } from "react";
import {
  getAllUsers,
  getAllRoles,
  createUser,
  updateUser,
  changeUserStatus,
  deleteUser,
} from "../services/userService";

/**
 * Hook personalizado para gestionar usuarios
 * Centraliza la lógica de gestión de usuarios y estados
 */
const useUsuarios = () => {
  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Cargar usuarios y roles iniciales
  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      // Cargar usuarios y roles en paralelo
      const [usuariosData, rolesData] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);
      
      setUsuarios(usuariosData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setErrorMsg(error.message || "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Mostrar mensajes temporales
  const mostrarMensajeExito = (mensaje) => {
    setSuccessMsg(mensaje);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const mostrarMensajeError = (mensaje) => {
    setErrorMsg(mensaje);
    setTimeout(() => setErrorMsg(null), 3000);
  };

  // Abrir modal para crear usuario
  const abrirModalCreacion = () => {
    setUsuarioEditando(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar usuario
  const abrirModalEdicion = (usuario) => {
    setUsuarioEditando(usuario);
    setModalAbierto(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  // Guardar usuario (crear o actualizar)
  const guardarUsuario = async (datosUsuario) => {
    try {
      if (usuarioEditando) {
        // Actualizar usuario existente
        const usuarioActualizado = await updateUser(usuarioEditando.id, datosUsuario);
        
        // Actualizar lista de usuarios
        setUsuarios(
          usuarios.map((u) => u.id === usuarioEditando.id ? usuarioActualizado : u)
        );
        
        mostrarMensajeExito("Usuario actualizado exitosamente");
      } else {
        // Crear nuevo usuario
        const nuevoUsuario = await createUser(datosUsuario);
        setUsuarios([...usuarios, nuevoUsuario]);
        mostrarMensajeExito("Usuario creado exitosamente");
      }
      
      cerrarModal();
    } catch (error) {
      mostrarMensajeError(error.message);
    }
  };

  // Cambiar estado de un usuario
  const cambiarEstadoUsuario = async (id, estadoActual) => {
    try {
      await changeUserStatus(id, !estadoActual);
      
      // Actualizar lista de usuarios
      setUsuarios(
        usuarios.map((u) => {
          if (u.id === id) {
            return { ...u, estado: !estadoActual };
          }
          return u;
        })
      );
      
      mostrarMensajeExito(
        `Usuario ${!estadoActual ? "activado" : "desactivado"} exitosamente`
      );
    } catch (error) {
      mostrarMensajeError(error.message);
    }
  };

  // Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await deleteUser(id);
        setUsuarios(usuarios.filter((u) => u.id !== id));
        mostrarMensajeExito("Usuario eliminado exitosamente");
      } catch (error) {
        mostrarMensajeError(error.message);
      }
    }
  };

  // Obtener nombre del rol por ID
  const obtenerNombreRol = (rolId) => {
    const rol = roles.find((r) => r.id === rolId);
    return rol ? rol.nombre : "Desconocido";
  };

  // Retornar todos los estados y funciones necesarios
  return {
    // Estados
    usuarios,
    roles,
    loading,
    errorMsg,
    successMsg,
    modalAbierto,
    usuarioEditando,
    
    // Funciones
    cargarDatos,
    abrirModalCreacion,
    abrirModalEdicion,
    cerrarModal,
    guardarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
    obtenerNombreRol,
  };
};

export default useUsuarios; 