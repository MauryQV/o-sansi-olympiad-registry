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

async function runTests() {
    try {
        // 1. Obtener todos los tutores
        console.log('\n🔍 Probando obtener todos los tutores...');
        const allTutores = await axios.get(`${API_URL}/tutores`);
        printResult('Todos los tutores:', allTutores.data);

        // 2. Buscar tutores por apellido "perez"
        console.log('\n🔍 Probando búsqueda por apellido "perez"...');
        const searchResult = await axios.get(`${API_URL}/buscar?query=perez`);
        printResult('Resultados de búsqueda:', searchResult.data);

        // 3. Obtener tutor específico (ID: 1)
        console.log('\n🔍 Probando obtener tutor por ID...');
        const tutorById = await axios.get(`${API_URL}/tutores/1`);
        printResult('Tutor con ID 1:', tutorById.data);

        // 4. Intentar crear un tutor nuevo
        console.log('\n📝 Probando crear nuevo tutor...');
        const newTutor = {
            nombre: "Test",
            apellido: "Usuario",
            telefono: "76543210",
            correo: "test@test.com"
        };
        const createResult = await axios.post(`${API_URL}/tutores`, newTutor);
        printResult('Tutor creado:', createResult.data);

        // 5. Intentar crear un tutor duplicado (mismo correo)
        console.log('\n⚠️ Probando crear tutor duplicado...');
        try {
            await axios.post(`${API_URL}/tutores`, newTutor);
        } catch (error) {
            printResult('Error esperado al crear duplicado:', error.response.data);
        }

        // 6. Buscar por correo específico
        console.log('\n🔍 Probando búsqueda por correo...');
        const emailSearch = await axios.get(`${API_URL}/buscar?query=test@test.com`);
        printResult('Búsqueda por correo:', emailSearch.data);

        // 7. Buscar tutor que no existe (ID alto)
        console.log('\n🔍 Probando búsqueda de tutor inexistente...');
        try {
            await axios.get(`${API_URL}/tutores/999`);
        } catch (error) {
            printResult('Error esperado al buscar ID inexistente:', error.response.data);
        }

        // 8. Eliminar el tutor de prueba
        console.log('\n🗑️ Probando eliminar tutor...');
        const deleteResult = await axios.delete(`${API_URL}/${createResult.data.id_tutor}`);
        printResult('Resultado de eliminación:', deleteResult.data);

        // 9. Verificar que el tutor fue eliminado
        console.log('\n✅ Verificando eliminación...');
        try {
            await axios.get(`${API_URL}/tutores/${createResult.data.id_tutor}`);
        } catch (error) {
            printResult('Error esperado al buscar tutor eliminado:', error.response.data);
        }

    } catch (error) {
        handleError(error, 'ejecución de pruebas');
    }
}

// Ejecutar todas las pruebas
console.log('🚀 Iniciando pruebas de API...');
runTests().then(() => {
    console.log('\n✅ Pruebas completadas!');
}).catch(error => {
    console.error('\n❌ Error en las pruebas:', error);
});
