const { execSync } = require('child_process');
const path = require('path');

console.log('\n' + '='.repeat(80));
console.log(' INICIANDO PRUEBAS COMPLETAS DE VALIDACIÓN DEL SISTEMA');
console.log('='.repeat(80));

/**
 * Función que ejecuta un script y muestra un mensaje informativo
 * @param {string} scriptName - Nombre del archivo de script a ejecutar
 * @param {string} description - Descripción de las pruebas
 */
function runTest(scriptName, description) {
    const scriptPath = path.join(__dirname, scriptName);
    
    console.log('\n' + '='.repeat(80));
    console.log(`🧪 EJECUTANDO: ${description}`);
    console.log('='.repeat(80) + '\n');
    
    try {
        // Ejecutamos el script y mostramos su salida
        execSync(`node ${scriptPath}`, { stdio: 'inherit' });
        console.log(`\n✅ ${description} completadas exitosamente`);
    } catch (error) {
        console.error(`\n❌ Error al ejecutar ${description}`);
        console.error(error.message);
    }
}

// Secuencia de pruebas a ejecutar
const testsToRun = [
    { script: 'testQueries.js', description: 'Pruebas de Tutores' },
    { script: 'testCompetidores.js', description: 'Pruebas de Competidores' }
];

// Ejecutamos las pruebas de manera secuencial
async function runAllTests() {
    console.log('\n Plan de pruebas:');
    testsToRun.forEach((test, index) => {
        console.log(`   ${index + 1}. ${test.description}`);
    });
    
    console.log('\n Comenzando pruebas...\n');
    
    // Para cada test en la secuencia
    for (const test of testsToRun) {
        runTest(test.script, test.description);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ TODAS LAS PRUEBAS COMPLETADAS');
    console.log('='.repeat(80));
}

// Iniciar todas las pruebas
runAllTests().catch(error => {
    console.error('\n❌ Error general en la ejecución de pruebas:', error);
    process.exit(1);
}); 