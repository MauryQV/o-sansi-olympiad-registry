import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
import { Server } from 'socket.io';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import convocatoriaRoutes from './routes/convocatoriaRoutes.js';
import areaRoutes from './routes/areaRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import inscripcionRoutes from './routes/inscripcionRoutes.js';
import competidorRoutes from './routes/competidorRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Inicializar Express
const app = express();

// Crear servidor HTTP basado en la app de Express
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Rutas
app.use('/api', authRoutes);
app.use('/api', convocatoriaRoutes);
app.use('/api', areaRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', tutorRoutes);
app.use('/api', inscripcionRoutes);
app.use('/api', locationRoutes);
app.use('/api', competidorRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/usuarios', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('<title>O! SANSI API</title><h1>API REST para O! SANSI Olympiad Registry</h1>');
});

// Middleware de manejo de errores (debe ser el último middleware)
app.use(errorHandler);

// Configuración de Socket.IO
const connectedUsers = new Map();

io.on('connection', (socket) => {
    socket.on('registrar_usuario', (userId) => {
        connectedUsers.set(userId, socket.id);
        console.log(`Usuario conectado: ${userId}`);
    });

    socket.on('disconnect', () => {
        for (const [id, sockId] of connectedUsers.entries()) {
            if (sockId === socket.id) {
                connectedUsers.delete(id);
                console.log(`Usuario desconectado: ${id}`);
                break;
            }
        }
    });
});

// Puerto
const port = process.env.PORT || 3000;

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor escuchando en puerto: ${port}`);
});

export { app, server, io, connectedUsers };