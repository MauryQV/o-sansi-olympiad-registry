export const errorHandler = (err, req, res, next) => {
    console.error(err);
    
    // Errores de validación (duplicados, coherencia de fechas/grados)
    if (err.message.includes('Ya existe') || 
        err.message.includes('debe ser') || 
        err.message.includes('no puede') ||
        err.message.includes('inválido') ||
        err.message.includes('esta categoría ya está asignada') ||
        err.message.includes('esta área ya está asignada')) {
        return res.status(400).json({ 
            error: err.message,
            type: 'validation_error'
        });
    }
    
    // Errores de recursos no encontrados
    if (err.message.includes('no existen') || 
        err.message.includes('no encontrado')) {
        return res.status(404).json({ 
            error: err.message,
            type: 'not_found_error'
        });
    }
    
    // Error de base de datos de Prisma
    if (err.code && err.code.startsWith('P')) {
        return res.status(400).json({ 
            error: 'Error en la base de datos: ' + err.message,
            type: 'database_error',
            code: err.code
        });
    }
    
    // Error genérico para cualquier otro caso
    res.status(500).json({ 
        error: err.message || 'Error interno del servidor',
        type: 'server_error'
    });
};
