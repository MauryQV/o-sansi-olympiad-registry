import { useState, useEffect, use } from 'react';
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
    const [areas, setAreas] = useState([]);

    // Fetch departamentos
    useEffect(() => {
        axios.get('http://localhost:7777/api/departamentos')
            .then(res => setDepartamentos(res.data))
            .catch(err => console.error('Error cargando departamentos:', err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:7777/api/ver-areas')
            .then(res => {
                console.log('Áreas cargadas:', res.data);
                setAreas(res.data);
            })
            .catch(err => {
                console.error('Error cargando áreas:', err);
                // Establecer un valor por defecto en caso de error
                setAreas([]);
            });
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

        // Manejo especial para el campo área
        if (id === 'area') {
            console.log(`Seleccionada área con valor: ${value}`);
            if (value === "") {
                // Si se selecciona la opción vacía
                setTutorData(prev => ({
                    ...prev,
                    area: '',
                    area_id: ''
                }));
            } else {
                // Buscar el área seleccionada por ID
                const selectedArea = areas.find(area => area.id.toString() === value);
                console.log('Área seleccionada:', selectedArea);

                if (selectedArea) {
                    setTutorData(prev => ({
                        ...prev,
                        area: selectedArea.nombre,  // Guardar el nombre del área
                        area_id: selectedArea.id    // Guardar el ID del área
                    }));
                }
            }
        } else {
            // Manejo normal para otros campos
            const setter = userType === 'competidor' ? setFormData : setTutorData;
            setter(prev => ({ ...prev, [id]: value }));
        }

            // Validar edad en tiempo real si la fecha de nacimineto esta detro del rango del sistemas no > a 19 años y no < a 8 años
            if (userType === 'competidor' && id === 'birthDate') {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            if (age < 8 || age > 19) {
                setErrors(prev => ({
                ...prev,
                birthDate: 'Usted no se encuentra dentro del rango de edades permitido en el sistema.'
                }));
            } else {
                setErrors(prev => {
                const { birthDate, ...rest } = prev;
                return rest;
                });
            }       
        }
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
        areas,
        handleInputChange,
        handleNameChange,
        handleIdChange,
        handleEmailChange,
        handleSubmit
    };
};
