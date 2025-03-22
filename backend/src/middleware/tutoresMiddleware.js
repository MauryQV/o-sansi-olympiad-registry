const validateTutorData = (req, res, next) => {
    const { nombre, apellido, telefono, correo } = req.body;


    if (!nombre?.trim() || !apellido?.trim() || !telefono?.trim() || !correo?.trim()) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        return res.status(400).json({ error: 'Formato de correo inválido' });
    }

    next();
};

module.exports = {

    validateTutorData
}