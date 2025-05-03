
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
  
    const regexCarnet = /^[0-9]{5,9}(-[0-9A-Za-z]{1,3})?$/;
    if (!formData.contraseña.trim()) {
      errores.contraseña = 'La contraseña es obligatoria.';
    } else if (!regexCarnet.test(formData.contraseña.trim())) {
      errores.contraseña = 'Carnet inválido. Ej: 13752158 o 13752158-2T';
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
      const limpio = value.replace(/\s/g, ''); 
      if (limpio.length <= 13) { // 9 nums + "-" + 3 letras
        setFormData({ ...formData, [name]: limpio });
      }
    
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  //login
  
  export const validateLogin = (formData) => {
    const errores = {};
    const regexCarnet = /^[0-9]{5,9}(-[0-9A-Za-z]{1,3})?$/;
  
    if (!formData.correo.trim()) {
      errores.correo = 'El correo es obligatorio.';
    } else if (!formData.correo.endsWith('@gmail.com')) {
      errores.correo = 'El correo debe terminar en @gmail.com.';
    }
  
    if (!formData.contraseña.trim()) {
      errores.contraseña = 'La contraseña es obligatoria.';
    } else if (!regexCarnet.test(formData.contraseña.trim())) {
      errores.contraseña = 'Carnet inválido. Ej: 13752158 o 13752158-2T';
    }
  
    return errores;
  };
  