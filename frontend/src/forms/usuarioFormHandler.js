
export const initialUsuarioData = {
    nombre: '',
    correo: '',
    telefono: '',
    rol: '',
    contraseña: '',
    activo: true
  };
  
  export const validateUsuarioForm = (formData) => {
    const errores = {};
  
    if (!formData.nombre.trim()) {
      errores.nombre = 'El nombre es obligatorio.';
    } else if (formData.nombre.length > 70) {
      errores.nombre = 'El nombre no puede superar los 70 caracteres.';
    }
  
    if (!formData.correo.trim()) {
      errores.correo = 'El correo es obligatorio.';
    } else if (!formData.correo.endsWith('@gmail.com')) {
      errores.correo = 'El correo debe terminar en @gmail.com.';
    }
  
    if (!formData.telefono.trim()) {
      errores.telefono = 'El número de teléfono es obligatorio.';
    } else if (formData.telefono.length !== 8) {
      errores.telefono = 'El número debe tener exactamente 8 dígitos.';
    }
  
    if (!formData.rol) {
      errores.rol = 'Debe seleccionar un rol.';
    }
  
    const regexContraseña = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,50}$/;
    if (!formData.contraseña.trim()) {
      errores.contraseña = 'La contraseña es obligatoria.';
    } else if (!regexContraseña.test(formData.contraseña)) {
      errores.contraseña = 'Debe tener 8-50 caracteres, una mayúscula y un carácter especial.';
    }
  
    return errores;
  };
  



export const handleUsuarioInputChange = (formData, setFormData) => (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === 'nombre') {
      const soloLetras = value.replace(/[0-9]/g, '');
      if (soloLetras.length <= 70) {
        setFormData({ ...formData, [name]: soloLetras });
      }
    } else if (name === 'telefono') {
      const soloNumeros = value.replace(/[^0-9]/g, '');
      if (soloNumeros.length <= 8) {
        setFormData({ ...formData, [name]: soloNumeros });
      }
    } else if (name === 'correo') {
      setFormData({ ...formData, [name]: value });
    } else if (name === 'contraseña') {
      if (value.length <= 50) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  