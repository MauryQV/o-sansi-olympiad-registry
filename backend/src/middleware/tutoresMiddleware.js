const supabase = require('../config/supabaseClient');

const validarDatosTutor = (req, res, next) => {
    const { nombre, apellido, telefono, correo } = req.body;
    const errores = [];

    // Validar campos requeridos
    if (!nombre || !nombre.trim()) errores.push('El nombre es requerido');
    if (!apellido || !apellido.trim()) errores.push('El apellido es requerido');
    if (!telefono || !telefono.trim()) errores.push('El teléfono es requerido');
    if (!correo || !correo.trim()) errores.push('El correo es requerido');

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo && !emailRegex.test(correo)) {
        errores.push('El formato del correo electrónico no es válido');
    }

    // Validar formato de teléfono (solo números y entre 7-10 dígitos)
    const phoneRegex = /^\d{7,10}$/;
    if (telefono && !phoneRegex.test(telefono)) {
        errores.push('El teléfono debe contener entre 7 y 10 dígitos numéricos');
    }

    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    next();
};

const verificarDuplicado = async (req, res, next) => {
    try {
        const { correo } = req.body;

        const { data: existingTutor, error: searchError } = await supabase
            .from('tutor')
            .select('*')
            .eq('correo', correo)
            .single();

        if (searchError && searchError.code !== 'PGRST116') {
            throw searchError;
        }

        if (existingTutor) {
            return res.status(400).json({ error: 'Ya existe un tutor con este correo' });
        }

        next(); // el proceso se va al controlador

    } catch (error) {
        console.error('Error en verificarDuplicado:', error);
        res.status(500).json({ error: 'Error al verificar duplicados' });
    }
};

module.exports = {
    validarDatosTutor,
    verificarDuplicado
}