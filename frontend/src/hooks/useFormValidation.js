import { useState, useEffect } from 'react';

/**
 * Hook personalizado para validación de formularios
 * @param {Object} initialState - Estado inicial del formulario
 * @param {Function} validate - Función de validación
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 * @returns {Object} - Objeto con estado, errores, handleChange, handleSubmit, etc.
 */
export const useFormValidation = (initialState, validate, onSubmit) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    useEffect(() => {
        // Si hay errores y estamos intentando enviar, validamos
        if (isSubmitting) {
            const noErrors = Object.keys(errors).length === 0;
            if (noErrors) {
                onSubmit(values);
                setIsSubmitting(false);
            } else {
                setIsSubmitting(false);
            }
        }
    }, [errors, isSubmitting, onSubmit, values]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });

        // Validamos el campo específico cuando pierde el foco
        const fieldErrors = validate({ [name]: values[name] });
        const relevantError = fieldErrors[name];

        setErrors(prev => ({
            ...prev,
            [name]: relevantError
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Marcamos todos los campos como tocados
        const allTouched = Object.keys(values).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        // Validamos todos los campos
        const validationErrors = validate(values);
        setErrors(validationErrors);
        setIsSubmitting(true);
    };

    const validateField = (name) => {
        const fieldErrors = validate({ [name]: values[name] });
        return fieldErrors[name];
    };

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        validateField,
        setValues
    };
}; 