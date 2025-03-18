const { processExcel } = require('../services/excelService');

const subirExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        }

        const result = await processExcel(req.file.path);
        res.json(result);
    } catch (error) {
        console.error('Error en subirExcel:', error);
        res.status(500).json({ error: 'Error al procesar el archivo' });
    }
};

module.exports = { subirExcel };