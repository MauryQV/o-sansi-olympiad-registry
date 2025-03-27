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
    return error.response?.data || { error: error.message };
};

async function runCompetidoresTests() {
    try {
        console.log('\n🚀 INICIANDO PRUEBAS DE VALIDACIÓN DE COMPETIDORES...');

        // 1. Listar todos los competidores (base de referencia)
        console.log('\n🔍 Obteniendo todos los competidores...');
        const allCompetidores = await axios.get(`${API_URL}/competidores`);
        printResult('Lista de competidores:', allCompetidores.data);

        // 2. Prueba de validación: Intentar crear competidor sin datos
        console.log('\n❌ Prueba de validación: Crear competidor sin datos...');
        try {
            await axios.post(`${API_URL}/competidores`, {});
        } catch (error) {
            const errorData = handleError(error, 'crear competidor sin datos');
            printResult('Error esperado (validación de campos requeridos):', errorData);
        }

        // 3. Prueba de validación: Email con formato incorrecto
        console.log('\n❌ Prueba de validación: Email con formato incorrecto...');
        try {
            await axios.post(`${API_URL}/competidores`, {
                nombre: "Test",
                apellido: "Validacion",
                area: "Informática",
                email: "email-invalido"
            });
        } catch (error) {
            const errorData = handleError(error, 'email con formato incorrecto');
            printResult('Error esperado (validación de formato de email):', errorData);
        }

        // 4. Crear competidor válido
        console.log('\n✅ Creando competidor con datos válidos...');
        const nuevoCompetidor = {
            nombre: "Test",
            apellido: "Prueba",
            area: "Informatica",
            email: "test.prueba@test.com"
        };
        
        let competidorCreado;
        try {
            const createResult = await axios.post(`${API_URL}/competidores`, nuevoCompetidor);
            competidorCreado = createResult.data;
            printResult('Competidor creado exitosamente:', competidorCreado);
        } catch (error) {
            handleError(error, 'crear competidor válido');
            console.log('\n⚠️ No se pudo crear el competidor, continuando con las pruebas...');
        }

        // 5. Validación de duplicados: Intentar crear el mismo competidor otra vez
        if (competidorCreado) {
            console.log('\n❌ Prueba de validación: Crear competidor duplicado...');
            try {
                await axios.post(`${API_URL}/competidores`, nuevoCompetidor);
            } catch (error) {
                const errorData = handleError(error, 'crear competidor duplicado');
                printResult('Error esperado (validación de duplicados):', errorData);
            }

            // 6. Buscar por email específico
            console.log('\n🔍 Buscando competidor por email...');
            try {
                const emailSearch = await axios.get(`${API_URL}/buscar/competidores?query=${nuevoCompetidor.email}`);
                printResult('Resultado de búsqueda por email:', emailSearch.data);
            } catch (error) {
                handleError(error, 'buscar por email');
            }

            // 7. Eliminar el competidor de prueba
            console.log('\n🗑️ Eliminando competidor de prueba...');
            try {
                const deleteResult = await axios.delete(`${API_URL}/competidores/${competidorCreado.id}`);
                printResult('Resultado de eliminación:', deleteResult.data);
            } catch (error) {
                handleError(error, 'eliminar competidor');
            }

            // 8. Verificar eliminación intentando obtener el competidor eliminado
            console.log('\n✅ Verificando eliminación...');
            try {
                await axios.get(`${API_URL}/competidores/${competidorCreado.id}`);
            } catch (error) {
                const errorData = handleError(error, 'verificar eliminación');
                printResult('Error esperado (competidor no encontrado):', errorData);
            }
        }

        // 9. Prueba de ID inexistente
        console.log('\n❌ Prueba de ID inexistente...');
        try {
            await axios.get(`${API_URL}/competidores/9999`);
        } catch (error) {
            const errorData = handleError(error, 'obtener ID inexistente');
            printResult('Error esperado (ID no encontrado):', errorData);
        }

    } catch (error) {
        console.error('\n❌ Error general en las pruebas:', error.message);
    }
}

// Ejecutar todas las pruebas
console.log('🧪 Iniciando pruebas de validación de competidores...');
runCompetidoresTests().then(() => {
    console.log('\n✅ Pruebas de competidores completadas!');
}).catch(error => {
    console.error('\n❌ Error en las pruebas:', error);
}); 