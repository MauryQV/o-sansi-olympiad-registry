import React, { useState, useEffect } from "react";

const FormularioUsuario = ({ usuario, roles, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    password: "",
    rol_id: "",
    carnet_identidad: "",
    estado: true,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Inicializar el formulario con los datos del usuario si se está editando
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo_electronico: usuario.correo_electronico || "",
        password: "", // No mostramos la contraseña actual por seguridad
        rol_id: usuario.rol_id || "",
        carnet_identidad:
          usuario.competidor?.carnet_identidad ||
          usuario.tutor?.carnet_identidad ||
          "",
        estado: usuario.estado !== undefined ? usuario.estado : true,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Limpiar error del campo cuando cambia
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar campos requeridos
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es requerido";
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es requerido";
    }

    if (!formData.correo_electronico.trim()) {
      nuevosErrores.correo_electronico = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo_electronico)) {
      nuevosErrores.correo_electronico =
        "El formato del correo electrónico no es válido";
    }

    // Solo validar contraseña si es un nuevo usuario o si se está intentando cambiar
    if (!usuario && !formData.password) {
      nuevosErrores.password =
        "La contraseña es requerida para nuevos usuarios";
    } else if (formData.password && formData.password.length < 6) {
      nuevosErrores.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.rol_id) {
      nuevosErrores.rol_id = "El rol es requerido";
    }

    if (!formData.carnet_identidad.trim()) {
      nuevosErrores.carnet_identidad = "El carnet de identidad es requerido";
    } else if (!/^\d+$/.test(formData.carnet_identidad)) {
      nuevosErrores.carnet_identidad =
        "El carnet de identidad debe contener solo números";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      // Si es edición y la contraseña está vacía, no la enviamos
      const datosAEnviar = { ...formData };
      if (usuario && !datosAEnviar.password) {
        delete datosAEnviar.password;
      }

      onGuardar(datosAEnviar);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              errors.apellido ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.apellido && (
            <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
          )}
        </div>
      </div>

      {/* Correo Electrónico */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Correo Electrónico
        </label>
        <input
          type="email"
          name="correo_electronico"
          value={formData.correo_electronico}
          onChange={handleChange}
          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.correo_electronico ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.correo_electronico && (
          <p className="mt-1 text-sm text-red-600">
            {errors.correo_electronico}
          </p>
        )}
      </div>

      {/* Contraseña */}
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
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Rol */}
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

      {/* Carnet de Identidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Carnet de Identidad
        </label>
        <input
          type="text"
          name="carnet_identidad"
          value={formData.carnet_identidad}
          onChange={handleChange}
          className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.carnet_identidad ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.carnet_identidad && (
          <p className="mt-1 text-sm text-red-600">{errors.carnet_identidad}</p>
        )}
      </div>

      {/* Estado */}
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
