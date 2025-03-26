const axios = require('axios');

const API_URL = 'http://localhost:7777/api';

// Función para imprimir resultados de manera formateada
const printResult = (title, data) => {
    console.log('\n' + '='.repeat(50));
    console.log(title);
    console.log('='.repeat(50));
    console.log(JSON.stringify(data, null, 2));
};

// Función para manejar errores
const handleError = (error, operation) => {
    console.error(`Error en ${operation}:`, error.response?.data || error.message);
};

async function deleteTutores() {
    try {
        const tutoresToDelete = [1, 4, 5, 6];
        
        for (const id of tutoresToDelete) {
            console.log(`\n🗑️ Eliminando tutor con ID ${id}...`);
            try {
                const deleteResult = await axios.delete(`${API_URL}/${id}`);
                printResult(`Resultado de eliminación del tutor ${id}:`, deleteResult.data);
            } catch (error) {
                console.error(`Error al eliminar tutor ${id}:`, error.response?.data || error.message);
            }
        }

        // Verificar la lista actualizada
        console.log('\n🔍 Verificando lista actualizada de tutores...');
        const remainingTutores = await axios.get(`${API_URL}/tutores`);
        printResult('Tutores restantes:', remainingTutores.data);

    } catch (error) {
        handleError(error, 'eliminación de tutores');
    }
}

// Ejecutar eliminación
console.log('🚀 Iniciando eliminación de tutores...');
deleteTutores().then(() => {
    console.log('\n✅ Proceso completado!');
}).catch(error => {
    console.error('\n❌ Error en el proceso:', error);
});
