import React from "react";
import { FaPlus } from "react-icons/fa";
import TablaUsuarios from "./components/TablaUsuarios";
import FormularioUsuario from "./components/FormularioUsuario";
import useUsuarios from "./hooks/useUsuarios";
import Modal from "./components/Modal";

/**
 * Componente principal para la gestión de usuarios
 * Implementa la HU05 - Administrar usuarios
 */
const GestionUsuarios = () => {
  const {
    usuarios,
    roles,
    loading,
    errorMsg,
    successMsg,
    modalAbierto,
    usuarioEditando,
    cargarDatos,
    abrirModalCreacion,
    abrirModalEdicion,
    cerrarModal,
    guardarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario,
    obtenerNombreRol,
  } = useUsuarios();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="ml-2">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">
            Administra los usuarios y sus roles en el sistema
          </p>
        </div>
        <button
          onClick={abrirModalCreacion}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <FaPlus className="mr-2" /> Nuevo Usuario
        </button>
      </div>

      {/* Mensajes de éxito o error */}
      {successMsg && (
        <div className="bg-green-100 text-green-700 p-4 mb-4 rounded flex items-center">
          <span className="font-medium">¡Éxito!</span>
          <span className="ml-2">{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-4 mb-4 rounded flex items-center">
          <span className="font-medium">Error:</span>
          <span className="ml-2">{errorMsg}</span>
        </div>
      )}

      {/* Tabla de usuarios */}
      <TablaUsuarios
        usuarios={usuarios}
        onEditar={abrirModalEdicion}
        onToggleEstado={cambiarEstadoUsuario}
        onEliminar={eliminarUsuario}
        obtenerNombreRol={obtenerNombreRol}
      />

      {/* Modal para crear/editar usuario */}
      {modalAbierto && (
        <Modal
          title={usuarioEditando ? "Editar Usuario" : "Nuevo Usuario"}
          onClose={cerrarModal}
        >
          <FormularioUsuario
            usuario={usuarioEditando}
            roles={roles}
            onGuardar={guardarUsuario}
            onCancelar={cerrarModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default GestionUsuarios;
