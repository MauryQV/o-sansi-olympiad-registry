import React from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

/**
 * Componente de tabla para mostrar la lista de usuarios
 */
const TablaUsuarios = ({
  usuarios,
  onEditar,
  onToggleEstado,
  onEliminar,
  obtenerNombreRol,
}) => {
  return (
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
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{`${usuario.nombre} ${usuario.apellido}`}</td>
                <td className="py-2 px-4 border-b">
                  {usuario.correo_electronico}
                </td>
                <td className="py-2 px-4 border-b">
                  {obtenerNombreRol(usuario.rol_id)}
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
                      onClick={() => onEditar(usuario)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => onToggleEstado(usuario.id, usuario.estado)}
                      className={`${
                        usuario.estado ? "text-green-600" : "text-red-600"
                      } hover:opacity-70`}
                      title={usuario.estado ? "Desactivar" : "Activar"}
                    >
                      {usuario.estado ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                    <button
                      onClick={() => onEliminar(usuario.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center border-b">
                No hay usuarios para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;
