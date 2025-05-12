import { useState, useEffect } from "react";

/**
 * Hook personalizado para manejar el formulario de usuario
 * @param {Object} usuarioInicial - Usuario a editar o null para nuevo usuario
 * @param {Function} onSubmit - Función a llamar al enviar el formulario
 */
const useFormularioUsuario = (usuarioInicial, onSubmit) => {
  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo_electronico: "",
    password: "",
    rol_id: "",
    carnet_identidad: "",
    estado: true,
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Actualizar el formulario cuando cambia el usuario inicial
  useEffect(() => {
    if (usuarioInicial) {
      setFormData({
        nombre: usuarioInicial.nombre || "",
        apellido: usuarioInicial.apellido || "",
        correo_electronico: usuarioInicial.correo_electronico || "",
        password: "", // No mostramos la contraseña actual por seguridad
        rol_id: usuarioInicial.rol_id || "",
        carnet_identidad:
          usuarioInicial.competidor?.carnet_identidad ||
          usuarioInicial.tutor?.carnet_identidad ||
          "",
        estado: usuarioInicial.estado !== undefined ? usuarioInicial.estado : true,
      });
    } else {
      // Reiniciar el formulario si no hay usuario
      setFormData({
        nombre: "",
        apellido: "",
        correo_electronico: "",
        password: "",
        rol_id: "",
        carnet_identidad: "",
        estado: true,
      });
    }
    
    // Limpiar errores al cambiar el usuario
    setErrors({});
  }, [usuarioInicial]);

  // Manejar cambios en los campos del formulario
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

  // Validar el formulario
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
    if (!usuarioInicial && !formData.password) {
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

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validarFormulario()) {
      // Si es edición y la contraseña está vacía, no la enviamos
      const datosAEnviar = { ...formData };
      if (usuarioInicial && !datosAEnviar.password) {
        delete datosAEnviar.password;
      }

      onSubmit(datosAEnviar);
    }
  };

  // Alternar visibilidad de la contraseña
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    formData,
    errors,
    showPassword,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  };
};

export default useFormularioUsuario; 