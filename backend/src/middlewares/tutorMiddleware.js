import { validarCarnetIdentidad, validarCorreoElectronico, validarTelefono } from '../services/tutorService.js';

/**
 * Middleware para validar los datos de un tutor
 */
export const validarDatosTutor = (req, res, next) => {
    const { nombre, apellido, carnet_identidad, correo_electronico, telefono, password } = req.body;
    
    // Validar campos obligatorios
    if (!nombre || !apellido || !carnet_identidad || !correo_electronico || !password) {
        return res.status(400).json({ 
            error: 'Todos los campos marcados con * son obligatorios',
            campos_faltantes: {
                nombre: !nombre,
                apellido: !apellido,
                carnet_identidad: !carnet_identidad,
                correo_electronico: !correo_electronico,
                password: !password
            }
        });
    }
    
    // Validar formato de correo electrónico
    if (!validarCorreoElectronico(correo_electronico)) {
        return res.status(400).json({ 
            error: 'El formato del correo electrónico es inválido'
        });
    }
    
    // Validar formato de carnet de identidad
    if (!validarCarnetIdentidad(carnet_identidad)) {
        return res.status(400).json({ 
            error: 'El formato del carnet de identidad es inválido (debe tener exactamente 7 dígitos numéricos)'
        });
    }
    
    // Validar formato de teléfono (si se proporcionó)
    if (telefono && !validarTelefono(telefono)) {
        return res.status(400).json({ 
            error: 'El formato del teléfono es inválido (debe ser un número celular boliviano de 8 dígitos)'
        });
    }
    
    // Validar complejidad de contraseña
    if (password.length < 8) {
        return res.status(400).json({ 
            error: 'La contraseña debe tener al menos 8 caracteres'
        });
    }
    
    next();
}; 