# Backend - Sistema de Inscripciones O! SANSI

Este es el backend del sistema de inscripciones para las olimpiadas universitarias UMSS O! SANSI.

## Validaciones implementadas

Se han implementado validaciones robustas para evitar registros duplicados y errores en los datos:

### Validaciones para Tutores

- **Campos requeridos**: nombre, apellido, teléfono, correo
- **Formato de correo electrónico**: validación mediante regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Formato de teléfono**: 7-10 dígitos numéricos (`/^\d{7,10}$/`)
- **Verificación de duplicados**: previene registros con el mismo correo electrónico

### Validaciones para Competidores (Nuevo)

- **Campos requeridos**: nombre, apellido, área, email
- **Formato de correo electrónico**: misma validación que para tutores
- **Verificación de duplicados**: previene registros con el mismo email

## Endpoints de la API

### Tutores

- `GET /api/tutores` - Obtener todos los tutores
- `GET /api/tutores/:id` - Obtener un tutor específico por ID
- `POST /api/tutores` - Crear un nuevo tutor (con validaciones)
- `DELETE /api/:id` - Eliminar un tutor
- `GET /api/buscar?query=texto` - Buscar tutores por nombre, apellido o correo

### Competidores (Nuevo)

- `GET /api/competidores` - Obtener todos los competidores
- `GET /api/competidores/:id` - Obtener un competidor específico por ID
- `POST /api/competidores` - Crear un nuevo competidor (con validaciones)
- `DELETE /api/competidores/:id` - Eliminar un competidor
- `GET /api/buscar/competidores?query=texto` - Buscar competidores por nombre, apellido o email

## Formato de respuestas

### Respuestas exitosas

- Lista de elementos: Array de objetos
- Elemento único: Objeto con propiedades del elemento
- Creación exitosa: Status 201 con el objeto creado
- Eliminación: Status 200 con mensaje de confirmación

### Respuestas de error

- **Validación de campos**: Status 400 con array de errores
  ```json
  {
    "errores": [
      "El nombre es requerido",
      "El formato del correo electrónico no es válido"
    ]
  }
  ```
- **Duplicados**: Status 400 con mensaje específico
  ```json
  {
    "error": "Ya existe un competidor registrado con este email"
  }
  ```
- **Elemento no encontrado**: Status 404
  ```json
  {
    "error": "Competidor no encontrado"
  }
  ```
- **Error del servidor**: Status 500 con detalles
  ```json
  {
    "error": "Error al crear competidor",
    "details": "Detalles técnicos del error"
  }
  ```

## Ejemplos de uso

### Crear un nuevo competidor

```javascript
// Desde el frontend con fetch
fetch("http://localhost:7777/api/competidores", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nombre: "Juan",
    apellido: "Pérez",
    area: "Informática",
    email: "juan.perez@ejemplo.com",
  }),
})
  .then((response) => {
    if (!response.ok) {
      return response.json().then((err) => Promise.reject(err));
    }
    return response.json();
  })
  .then((data) => console.log("Competidor creado:", data))
  .catch((error) => console.error("Error:", error));
```

### Buscar competidores

```javascript
// Desde el frontend con axios
axios
  .get("http://localhost:7777/api/buscar/competidores?query=perez")
  .then((response) => {
    console.log("Resultados:", response.data);
  })
  .catch((error) => {
    console.error("Error en la búsqueda:", error.response.data);
  });
```

## Instalación y uso

1. **Instalar dependencias**:

```bash
npm install
```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env` y configura las variables:

```
PORT=7777
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_de_supabase
```

3. **Iniciar el servidor**:

```bash
npm run dev
```

## Pruebas

Se han creado scripts de prueba para verificar el correcto funcionamiento:

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar pruebas específicas

```bash
# Pruebas de tutores
npm run test:tutores

# Pruebas de competidores
npm run test:competidores
```

## Estructura de archivos

- **Controllers**: `/src/controllers/`

  - `tutoresController.js` - Lógica para gestionar tutores
  - `competidoresController.js` - Lógica para gestionar competidores

- **Middleware**: `/src/middleware/`

  - `tutoresMiddleware.js` - Validaciones para tutores
  - `competidoresMiddleware.js` - Validaciones para competidores

- **Routes**: `/src/routes/`

  - `tutoresRoutes.js` - Rutas para API de tutores
  - `competidoresRoutes.js` - Rutas para API de competidores

- **Services**: `/src/services/`

  - `tutoresService.js` - Servicios relacionados con tutores

- **Tests**:
  - `testQueries.js` - Pruebas para API de tutores
  - `testCompetidores.js` - Pruebas para API de competidores
  - `runAllTests.js` - Script que ejecuta todas las pruebas
