const supabase = require('../config/supabaseClient');

/**
 * Middleware para validar los datos de un competidor
 */
const validarDatosCompetidor = (req, res, next) => {
    const { nombre, apellido, area, email } = req.body;
    const errores = [];

    // Validar campos requeridos
    if (!nombre || !nombre.trim()) errores.push('El nombre es requerido');
    if (!apellido || !apellido.trim()) errores.push('El apellido es requerido');
    if (!area || !area.trim()) errores.push('El área es requerida');
    if (!email || !email.trim()) errores.push('El email es requerido');

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errores.push('El formato del correo electrónico no es válido');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    next();
};

/**
 * Middleware para verificar si ya existe un competidor con el mismo email
 */
const verificarCompetidorDuplicado = async (req, res, next) => {
    try {
        const { email } = req.body;

        const { data: existingCompetidor, error: searchError } = await supabase
            .from('competidores')
            .select('email')
            .eq('email', email)
            .single();

        if (searchError && searchError.code !== 'PGRST116') {
            throw searchError;
        }

        if (existingCompetidor) {
            return res.status(400).json({ error: 'Ya existe un competidor registrado con este email' });
        }

        next();
    } catch (error) {
        console.error('Error en verificarCompetidorDuplicado:', error);
        res.status(500).json({ 
            error: 'Error al verificar duplicados',
            details: error.message || 'Error desconocido'
        });
    }
};

module.exports = {
    validarDatosCompetidor,
    verificarCompetidorDuplicado
}; 