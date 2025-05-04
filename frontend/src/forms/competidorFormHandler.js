// Estado inicial del competidor
import axios from 'axios';

export const initialCompetidorData = {
    firstName: '',
    lastName: '',
    idNumber: '',
    birthDate: '',
    email: '',
    department: '',
    province: '',
    school: '',
    phone: ''
};

// Validación para el formulario de competidor
export const validateCompetidorForm = (formData, setErrors) => {
    const errors = {};

    if (!/^[a-zA-Z\s]{2,25}$/.test(formData.firstName)) {
        errors.firstName = 'Debe ingresar su nombre.';
    }
    if (!/^[a-zA-Z\s]{2,25}$/.test(formData.lastName)) {
        errors.lastName = 'Debe ingresar su apellido.';
    }
    if (!/^[a-zA-Z0-9]{5,10}$/.test(formData.idNumber)) {
        errors.idNumber = 'Número de carnet inválido.';
    }
    if (!formData.birthDate) {
        errors.birthDate = 'Debe seleccionar su fecha de nacimiento.';
      } else {
        const today = new Date();
        const birthDate = new Date(formData.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--; // Todavía no ha cumplido años este año
        }
        
        if (age < 8 || age > 18) {
          errors.birthDate = 'Usted no se encuentra dentro del rango de edades permitido en el sistema.';
        }
      }
      
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(formData.email)) {
        errors.email = 'Correo inválido.';
    }
    if (!formData.department) {
        errors.department = 'Debe seleccionar su departamento.';
    }
    if (!formData.province) {
        errors.province = 'Debe seleccionar su provincia.';
    }
    if (!formData.school) {
        errors.school = 'Debe seleccionar su centro educativo.';
    }


    setErrors(errors);
    return Object.keys(errors).length === 0;
};


export const submitCompetidorForm = async (formData, setFormData, setErrors) => {
    if (!validateCompetidorForm(formData, setErrors)) return;

    const datitos = {
        nombre: formData.firstName,
        apellido: formData.lastName,
        carnet_identidad: formData.idNumber,
        fecha_nacimiento: formData.birthDate,
        correo_electronico: formData.email,
        provincia_id: formData.province,
        colegio_id: formData.school,
    };

    //console.log('debuggggg:', payload);

    try {
        const response = await axios.post('http://localhost:7777/api/registro-competidor', datitos);

        if (response.data && response.data.credenciales) {
            alert(`Competidor registrado exitosamente.\nCorreo: ${response.data.credenciales.correo_electronico}`);
        } else {
            alert('Competidor registrado exitosamente.');
        }

        setFormData(initialCompetidorData);
        setErrors({});

    } catch (error) {
        const serverMessage = error.response?.data?.message || '';
        const fieldErrors = {};

        if (serverMessage.includes('correo')) {
            fieldErrors.email = 'Este correo ya está registrado.';
        }
        if (serverMessage.includes('carnet') || serverMessage.includes('carnet_identidad')) {
            fieldErrors.idNumber = 'Este carnet ya está registrado.';
        }

        if (Object.keys(fieldErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...fieldErrors }));
        } else {
            alert('Error desconocido al registrar competidor.');
        }
    }
};
