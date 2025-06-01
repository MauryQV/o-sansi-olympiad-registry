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
import categoriaAreaRoutes from './routes/categoriaAreaRoutes.js';
import inscripcionRoutes from './routes/inscripcionRoutes.js';
import competidorRoutes from './routes/competidorRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import reportesRoutes from './routes/reportesRoutes.js';


// Inicializar Express
const app = express();

// Crear servidor HTTP basado en la app de Express
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
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
app.use('/api', categoriaAreaRoutes);
app.use('/api/reportes', reportesRoutes);

// Middleware de manejo de errores (debe ser el último middleware)
app.use(errorHandler);

// Configuración de Socket.IO
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('registrar_usuario', (userId) => {
        //console.log(`Usuario ${userId} registrado con socket ${socket.id}`);
        connectedUsers.set(userId, socket.id);
    });

    socket.on('disconnect', () => {
        //     console.log('Cliente desconectado:', socket.id);
        // Limpiar el usuario desconectado
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
    });
});

// Puerto
const port = process.env.PORT || 7777;

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor escuchando en puerto: ${port}`);
});

export { app, server, io, connectedUsers };