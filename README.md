# Registro de Tutores - O! SANSI Olympiad Registry

Implementación de la historia de usuario "Registro de tutores" que permite a los tutores registrarse en el sistema con validaciones robustas.

## Características implementadas

### 1. Formulario de Registro

- Campos para información personal (nombre, apellido, carnet de identidad)
- Campos para información de contacto (correo electrónico, teléfono)
- Campo para contraseña y confirmación
- Indicadores visuales de campos obligatorios
- Mensajes de éxito y error

### 2. Validaciones en Tiempo Real

- Validación de campos obligatorios
- Validación de formato de correo electrónico
- Validación de formato de carnet de identidad (formato: 7 dígitos numéricos)
- Validación de formato de teléfono (formato: 70123456)
- Validación de longitud de contraseña (mínimo 8 caracteres)
- Validación de coincidencia de contraseñas
- Feedback visual inmediato (bordes rojos, mensajes de error)

### 3. API para Registro de Tutores

- Endpoint para crear nuevos tutores
- Validaciones en el servidor
- Prevención de duplicados (carnet de identidad, correo electrónico)
- Integración con el sistema de autenticación
- Respuestas con códigos HTTP apropiados y mensajes descriptivos

## Estructura del modelo de datos

La implementación está adaptada a la siguiente estructura de base de datos:

- **Usuario**: Contiene información personal (nombre, apellido, correo_electronico)
- **Tutor**: Contiene el carnet_identidad y relación con Usuario (usuario_id)
- **Rol**: Define los roles de usuario, incluido el rol "tutor"

Relaciones importantes:

- Cada `Tutor` está relacionado con un `Usuario` mediante la columna `usuario_id` (relación uno a uno)
- Cada `Usuario` tiene un `Rol` asignado mediante la columna `rol_id`

## Archivos creados y modificados

### Backend:

- `src/services/tutorService.js`: Lógica de negocio para gestión de tutores
- `src/controllers/tutorController.js`: Controlador para manejar peticiones HTTP
- `src/routes/tutorRoutes.js`: Definición de rutas para la API
- `src/middlewares/tutorMiddleware.js`: Middleware para validación de datos
- `scripts/setupRoles.js`: Script para configurar roles necesarios

### Frontend:

- `src/hooks/useFormValidation.js`: Hook personalizado para validación de formularios
- `src/utils/validations.js`: Funciones de validación reutilizables
- `src/services/tutorService.js`: Servicios para comunicación con la API
- `src/components/TutorRegistroForm.jsx`: Componente del formulario de registro
- `src/pages/TutorRegistroPage.jsx`: Página que contiene el formulario

### Archivos modificados

- `backend/src/index.js`: Agregada la importación y uso de las rutas de tutores
- `frontend/src/App.jsx`: Agregada la ruta para la página de registro de tutores
- `backend/src/middlewares/errorHandler.js`: Mejorado el manejo de errores específicos

## Tests

### 1. Configuración previa

1. Asegúrate de tener la base de datos PostgreSQL configurada
2. Configura las variables de entorno en `.env` (especialmente la URL de la base de datos)
3. Ejecuta el script para crear los roles necesarios:
   ```
   cd backend
   node scripts/setupRoles.js
   ```

### 2. API (Backend)

1. Inicia el servidor:

   ```
   cd backend
   npm run dev
   ```

2. Usa Postman o cualquier cliente HTTP para probar el endpoint:

   - URL: `POST http://localhost:7777/api/tutores/registro`
   - Cuerpo (JSON):
     ```json
     {
       "nombre": "Juan",
       "apellido": "Pérez",
       "carnet_identidad": "1234567",
       "correo_electronico": "prueba@gmail.com",
       "telefono": "70123456",
       "password": "password123"
     }
     ```

3. Respuesta exitosa esperada:
   ```json
   {
     "mensaje": "Tutor registrado exitosamente",
     "tutor": {
       "id": "uuid-generado",
       "nombre": "Juan",
       "apellido": "Pérez",
       "carnet_identidad": "1234567",
       "correo_electronico": "prueba@gmail.com"
     }
   }
   ```

### 3. Formulario (Frontend)

1. Inicia la aplicación:

   ```
   cd frontend
   npm run dev
   ```

2. Navega a `http://localhost:5173/registro-tutor`
3. Prueba el formulario con diferentes escenarios:
   - Deja campos obligatorios en blanco
   - Ingresa formatos inválidos (correo, carnet, teléfono)
   - Ingresa contraseñas que no coinciden
   - Completa correctamente todos los campos

## Pruebas que puedes realizar

### Validación de campos requeridos

- Intenta enviar el formulario sin completar todos los campos obligatorios
- Verifica que aparezcan mensajes de error para cada campo requerido

### Validación de formato

- Prueba formatos inválidos de correo (sin @, sin dominio)
- Prueba formatos inválidos de carnet (menos de 7 dígitos, con letras)
- Prueba formatos inválidos de teléfono (números que no empiecen con 6 o 7)

### Validación de duplicados

- Intenta registrar un tutor con un carnet ya existente
- Intenta registrar un tutor con un correo ya existente

### Registro exitoso

- Completa correctamente todos los campos
- Verifica que se muestre el mensaje de éxito
- Verifica que se redireccione a la página de inicio de sesión
