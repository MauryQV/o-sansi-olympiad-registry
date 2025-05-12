import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";
import FormularioUsuario from "./FormularioUsuario";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Obtener el token de autenticación del localStorage
  const token = localStorage.getItem("token");

  // Configuración para las peticiones con autenticación
  const config = {
    headers: {
      Authorization: token,
    },
  };

  // Cargar usuarios y roles al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usuariosRes, rolesRes] = await Promise.all([
          axios.get(`${API_URL}/usuarios`, config),
          axios.get(`${API_URL}/usuarios/roles`, config),
        ]);

        setUsuarios(usuariosRes.data);
        setRoles(rolesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(
          "Error al cargar los datos. Por favor, intenta de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mostrar modal para crear nuevo usuario
  const handleNuevoUsuario = () => {
    setUsuarioEditando(null);
    setModalAbierto(true);
  };

  // Mostrar modal para editar usuario
  const handleEditarUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setModalAbierto(true);
  };

  // Cambiar estado de un usuario (activar/desactivar)
  const handleToggleEstado = async (id, estadoActual) => {
    try {
      await axios.patch(
        `${API_URL}/usuarios/${id}/status`,
        { estado: !estadoActual },
        config
      );

      // Actualizar lista de usuarios
      setUsuarios(
        usuarios.map((usuario) => {
          if (usuario.id === id) {
            return { ...usuario, estado: !estadoActual };
          }
          return usuario;
        })
      );

      setMensajeExito(
        `Usuario ${!estadoActual ? "activado" : "desactivado"} exitosamente`
      );
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      setMensajeError("Error al cambiar el estado del usuario");
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  // Eliminar usuario
  const handleEliminarUsuario = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
      )
    ) {
      try {
        await axios.delete(`${API_URL}/usuarios/${id}`, config);

        // Actualizar lista de usuarios
        setUsuarios(usuarios.filter((usuario) => usuario.id !== id));

        setMensajeExito("Usuario eliminado exitosamente");
        setTimeout(() => setMensajeExito(""), 3000);
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        setMensajeError(
          error.response?.data?.error || "Error al eliminar el usuario"
        );
        setTimeout(() => setMensajeError(""), 3000);
      }
    }
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
  };

  // Guardar usuario (crear o actualizar)
  const handleGuardarUsuario = async (datosUsuario) => {
    try {
      if (usuarioEditando) {
        // Actualizar usuario existente
        const response = await axios.put(
          `${API_URL}/usuarios/${usuarioEditando.id}`,
          datosUsuario,
          config
        );

        // Actualizar lista de usuarios
        setUsuarios(
          usuarios.map((usuario) => {
            if (usuario.id === usuarioEditando.id) {
              return response.data;
            }
            return usuario;
          })
        );

        setMensajeExito("Usuario actualizado exitosamente");
      } else {
        // Crear nuevo usuario
        const response = await axios.post(
          `${API_URL}/usuarios`,
          datosUsuario,
          config
        );
        setUsuarios([...usuarios, response.data]);
        setMensajeExito("Usuario creado exitosamente");
      }

      setTimeout(() => setMensajeExito(""), 3000);
      handleCerrarModal();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      setMensajeError(
        error.response?.data?.error || "Error al guardar el usuario"
      );
      setTimeout(() => setMensajeError(""), 3000);
    }
  };

  // Obtener el nombre del rol según su ID
  const getNombreRol = (rolId) => {
    const rol = roles.find((r) => r.id === rolId);
    return rol ? rol.nombre : "Desconocido";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando...</p>
      </div>
    );
  if (error)
    return <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <button
          onClick={handleNuevoUsuario}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Nuevo Usuario
        </button>
      </div>

      {/* Mensajes de éxito o error */}
      {mensajeExito && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
          {mensajeExito}
        </div>
      )}
      {mensajeError && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
          {mensajeError}
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Correo</th>
              <th className="py-2 px-4 border-b">Rol</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{`${usuario.nombre} ${usuario.apellido}`}</td>
                <td className="py-2 px-4 border-b">
                  {usuario.correo_electronico}
                </td>
                <td className="py-2 px-4 border-b">
                  {getNombreRol(usuario.rol_id)}
                </td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded ${
                      usuario.estado
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {usuario.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditarUsuario(usuario)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        handleToggleEstado(usuario.id, usuario.estado)
                      }
                      className={
                        usuario.estado
                          ? "text-amber-600 hover:text-amber-800"
                          : "text-green-600 hover:text-green-800"
                      }
                      title={usuario.estado ? "Desactivar" : "Activar"}
                    >
                      {usuario.estado ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                      onClick={() => handleEliminarUsuario(usuario.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar usuario */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <FormularioUsuario
              usuario={usuarioEditando}
              roles={roles}
              onGuardar={handleGuardarUsuario}
              onCancelar={handleCerrarModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionUsuarios;
