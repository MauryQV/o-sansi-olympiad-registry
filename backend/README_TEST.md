# Backend - O! SANSI Olympiad Registry

### Tests de restricción de áreas

```bash
# Verificar la restricción de 2 áreas por participante
npm run test:validador

# Probar categorías de áreas
npm run test:areas

# Probar límites de áreas con base de datos
npm run test:limites

# Simular inscripción en áreas
npm run test:simulacion

# Prueba de concepto para restricción de áreas
npm run test:concepto
```

- `test/`: Scripts de prueba
  - `probarRestriccion.js`: Prueba para la restricción de áreas
  - `testAreaCategoria.js`: Prueba para categorías de áreas
  - `testMaximoAreas.js`: Prueba para límites de áreas
  - `testAreasSimulacion.js`: Simulación de inscripción en áreas
  - `testAreasRestriccion.js`: Prueba de concepto para restricción de áreas
