const xlsx = require('xlsx');
const supabase = require('../config/supabaseClient');
const fs = require('fs');

const processExcel = async (filePath) => {
    try {
        //lectura del documento
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);


        for (const row of data) {
            const { nombre, apellido, area, email } = row;

            //deberia ir al middleware?
            const { data: existing, error: selectError } = await supabase
                .from('competidores')
                .select('email')
                .eq('email', email);

            if (selectError) throw selectError;

            if (existing.length > 0) {
                console.warn(`El email ${email} ya existe. Saltando...`);
                continue;
            }

            // insercion en la bd
            const { error } = await supabase
                .from('competidores')
                .insert([{ nombre, apellido, area, email }]);

            if (error) throw error;
        }

        fs.unlinkSync(filePath);

        return { success: true, message: 'Datos procesados correctamente' };
    } catch (error) {
        console.error('Error en processExcel:', error);
        throw error;
    }
};

module.exports = { processExcel };