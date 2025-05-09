import axios from 'axios';

// Estado inicial, validaciones para el formulario de tutor


export const initialTutorData = {
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    phone: '',
    area_id: ''
};

// Validaciónes xd
export const validateTutorForm = (tutorData, setErrors) => {
    const errors = {};

    if (!/^[a-zA-Z\s]{2,25}$/.test(tutorData.firstName)) {
        errors.firstName = 'Debe ingresar un nombre válido.';
    }
    if (!/^[a-zA-Z\s]{2,25}$/.test(tutorData.lastName)) {
        errors.lastName = 'Debe ingresar un apellido válido.';
    }
    if (!/^[a-zA-Z0-9]{5,10}$/.test(tutorData.idNumber)) {
        errors.idNumber = 'Carnet inválido.';
    }
    if (!/^[67]\d{7}$/.test(tutorData.phone)) {
        errors.phone = 'Número de celular inválido.';
    }
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(tutorData.email)) {
        errors.email = 'Correo inválido.';
    }
    if (!tutorData.area_id) {
        errors.area = 'Debe seleccionar un área.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
};


export const createChangeHandler = (setState) => (e) => {
    const { id, value } = e.target;
    setState(prev => ({ ...prev, [id]: value }));
};

export const createNameChangeHandler = (setState) => (e) => {
    const { id } = e.target;
    const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, '').slice(0, 25);
    setState(prev => ({ ...prev, [id]: filtered }));
};

export const createIdChangeHandler = (setState) => (e) => {
    const filtered = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    setState(prev => ({ ...prev, idNumber: filtered }));
};

export const createEmailChangeHandler = (setState) => (e) => {
    const value = e.target.value.slice(0, 50);
    setState(prev => ({ ...prev, email: value }));
};


export const submitTutorForm = async (tutorData, setTutorData, setErrors) => {
    if (!validateTutorForm(tutorData, setErrors)) return;

    try {
        const response = await axios.post('http://localhost:7777/api/registro-tutor', {
            nombre: tutorData.firstName,
            apellido: tutorData.lastName,
            carnet_identidad: tutorData.idNumber,
            correo_electronico: tutorData.email,
            numero_celular: tutorData.phone,
            area_id: tutorData.area_id

        });

        alert(`Tutor registrado exitosamente.\nCorreo: ${response.data.credenciales.correo_electronico}`);

        setTutorData(initialTutorData);
        setErrors({});

    } catch (error) {
        console.error('Error al registrar tutor:', error.response?.data || error.message);
        alert('Error al registrar tutor.');
    }
};
