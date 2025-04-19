/**
 * Valida el formato del correo electrónico
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
export const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Valida el formato del carnet de identidad boliviano
 * @param {string} carnet - Carnet de identidad a validar
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
export const validarCarnet = (carnet) => {
    // Formato: 7 dígitos numéricos
    const regex = /^\d{7}$/;
    return regex.test(carnet);
};

/**
 * Valida el formato del número de teléfono boliviano
 * @param {string} telefono - Número de teléfono a validar
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
export const validarTelefono = (telefono) => {
    // Formato boliviano: 7 a 8 dígitos comenzando con 6 o 7
    const regex = /^[67]\d{7}$/;
    return regex.test(telefono);
};

/**
 * Valida la contraseña
 * @param {string} password - Contraseña a validar
 * @returns {boolean} - true si cumple con los requisitos, false en caso contrario
 */
export const validarPassword = (password) => {
    return password.length >= 8;
};

/**
 * Valida los datos de un tutor
 * @param {Object} values - Valores a validar
 * @returns {Object} - Objeto con errores de validación
 */
export const validarTutor = (values) => {
    let errors = {};
    
    // Validación de campos presentes
    if (!values.nombre && 'nombre' in values) {
        errors.nombre = 'El nombre es obligatorio';
    }
    
    if (!values.apellido && 'apellido' in values) {
        errors.apellido = 'El apellido es obligatorio';
    }
    
    // Validación de carnet
    if (!values.carnet_identidad && 'carnet_identidad' in values) {
        errors.carnet_identidad = 'El carnet de identidad es obligatorio';
    } else if ('carnet_identidad' in values && !validarCarnet(values.carnet_identidad)) {
        errors.carnet_identidad = 'El carnet debe tener exactamente 7 dígitos numéricos';
    }
    
    // Validación de correo
    if (!values.correo_electronico && 'correo_electronico' in values) {
        errors.correo_electronico = 'El correo electrónico es obligatorio';
    } else if ('correo_electronico' in values && !validarEmail(values.correo_electronico)) {
        errors.correo_electronico = 'El formato del correo electrónico no es válido';
    }
    
    // Validación de teléfono (opcional)
    if (values.telefono && 'telefono' in values && !validarTelefono(values.telefono)) {
        errors.telefono = 'El formato del teléfono debe ser un número celular boliviano de 8 dígitos';
    }
    
    // Validación de contraseña
    if (!values.password && 'password' in values) {
        errors.password = 'La contraseña es obligatoria';
    } else if ('password' in values && !validarPassword(values.password)) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    // Validación de confirmación de contraseña
    if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    return errors;
}; 