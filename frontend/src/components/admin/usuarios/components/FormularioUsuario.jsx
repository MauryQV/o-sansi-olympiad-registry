import React from "react";
import useFormularioUsuario from "../hooks/useFormularioUsuario";
import InputField from "./InputField";

/**
 * Componente de formulario para crear/editar usuarios
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.usuario - Usuario a editar (null para nuevo usuario)
 * @param {Array} props.roles - Lista de roles disponibles
 * @param {Function} props.onGuardar - Función a llamar al guardar
 * @param {Function} props.onCancelar - Función a llamar al cancelar
 */
const FormularioUsuario = ({ usuario, roles, onGuardar, onCancelar }) => {
  const {
    formData,
    errors,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useFormularioUsuario(usuario, onGuardar);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
        />

        <InputField
          label="Apellido"
          name="apellido"
          type="text"
          value={formData.apellido}
          onChange={handleChange}
          error={errors.apellido}
          required
        />
      </div>

      <InputField
        label="Correo Electrónico"
        name="correo_electronico"
        type="email"
        value={formData.correo_electronico}
        onChange={handleChange}
        error={errors.correo_electronico}
        required
      />

      {/* Contraseña con botón para mostrar/ocultar */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contraseña{" "}
          {usuario ? "(Dejar en blanco para mantener la actual)" : ""}
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-600 hover:text-gray-800"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Rol (select) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Rol</label>
        <select
          name="rol_id"
          value={formData.rol_id}
          onChange={handleChange}
          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.rol_id ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Seleccione un rol</option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>
              {rol.nombre}
            </option>
          ))}
        </select>
        {errors.rol_id && (
          <p className="mt-1 text-sm text-red-600">{errors.rol_id}</p>
        )}
      </div>

      <InputField
        label="Carnet de Identidad"
        name="carnet_identidad"
        type="text"
        value={formData.carnet_identidad}
        onChange={handleChange}
        error={errors.carnet_identidad}
        required
      />

      {/* Estado (checkbox) */}
      <div className="flex items-center">
        <input
          type="checkbox"
          name="estado"
          checked={formData.estado}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Usuario activo
        </label>
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {usuario ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
};

export default FormularioUsuario;
