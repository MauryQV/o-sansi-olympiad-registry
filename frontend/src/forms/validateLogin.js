// src/forms/validateLogin.js
export const validateLogin = ({ correo, contraseña }) => {
    const errors = {};
    if (!correo) errors.correo = "El correo es obligatorio.";
    if (!contraseña) errors.contraseña = "La contraseña es obligatoria.";
    return errors;
};
