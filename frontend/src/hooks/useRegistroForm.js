import { useState, useEffect } from 'react';
import { initialTutorData, validateTutorForm } from '../forms/tutorFormHandler';
import { validateCompetidorForm } from '../forms/competidorFormHandler';
import { submitTutorForm } from '../forms/tutorFormHandler';
import { submitCompetidorForm } from '../forms/competidorFormHandler';

import axios from 'axios';

const initialCompetidorData = {
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

const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === 'tutor') {
        const isValid = validateTutorForm(tutorData, setErrors);
        if (isValid) {
            await submitTutorForm(tutorData, setTutorData, setErrors);
        }
    } else {
        const isValid = validateCompetidorForm(formData, setErrors);
        if (isValid) {
            console.log('Datos válidos de competidor:', formData);
            // Aquí luego podrás hacer el submit de competidor también
        }
    }
};

export const useRegistroForm = () => {
    const [userType, setUserType] = useState('competidor');
    const [formData, setFormData] = useState(initialCompetidorData);
    const [tutorData, setTutorData] = useState(initialTutorData);
    const [departamentos, setDepartamentos] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [colegios, setColegios] = useState([]);
    const [errors, setErrors] = useState({});

    // Fetch departamentos
    useEffect(() => {
        axios.get('http://localhost:7777/api/departamentos')
            .then(res => setDepartamentos(res.data))
            .catch(err => console.error('Error cargando departamentos:', err));
    }, []);

    // Fetch provincias cuando cambia departamento
    useEffect(() => {
        if (formData.department) {
            axios.get(`http://localhost:7777/api/departamentos/${formData.department}/provincias`)
                .then(res => {
                    setProvincias(res.data);
                    setFormData(prev => ({ ...prev, province: '', school: '' }));
                    setColegios([]);
                })
                .catch(err => console.error('Error cargando provincias:', err));
        }
    }, [formData.department]);

    // Fetch colegios cuando cambia provincia
    useEffect(() => {
        if (formData.province) {
            axios.get(`http://localhost:7777/api/provincias/${formData.province}/colegios`)
                .then(res => {
                    setColegios(res.data);
                    setFormData(prev => ({ ...prev, school: '' }));
                })
                .catch(err => console.error('Error cargando colegios:', err));
        }
    }, [formData.province]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const setter = userType === 'competidor' ? setFormData : setTutorData;
        setter(prev => ({ ...prev, [id]: value }));
    };

    const handleNameChange = (e) => {
        const { id, value } = e.target;
        const cleanValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 25);
        const setter = userType === 'competidor' ? setFormData : setTutorData;
        setter(prev => ({ ...prev, [id]: cleanValue }));
    };

    const handleIdChange = (e) => {
        const { value } = e.target;
        const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
        const setter = userType === 'competidor' ? setFormData : setTutorData;
        setter(prev => ({ ...prev, idNumber: cleanValue }));
    };

    const handleEmailChange = (e) => {
        const { value } = e.target;
        const cleanValue = value.slice(0, 50);
        const setter = userType === 'competidor' ? setFormData : setTutorData;
        setter(prev => ({ ...prev, email: cleanValue }));
    };

    const validate = () => {
        if (userType === 'competidor') {
            return validateCompetidorForm(formData, setErrors);
        } else {
            return validateTutorForm(tutorData, setErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            if (userType === 'tutor') {
                await submitTutorForm(tutorData, setTutorData, setErrors);
            } else {
                await submitCompetidorForm(formData, setFormData, setErrors);
            }
        }
    };

    return {
        userType,
        setUserType,
        formData,
        tutorData,
        departamentos,
        provincias,
        colegios,
        errors,
        handleInputChange,
        handleNameChange,
        handleIdChange,
        handleEmailChange,
        handleSubmit
    };
};
