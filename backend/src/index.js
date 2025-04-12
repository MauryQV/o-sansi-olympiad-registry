import express from 'express'
import "dotenv/config";
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import convocatoriaRoutes from './routes/convocatoriaRoutes.js';
import areaRoutes from './routes/areaRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api', authRoutes);
app.use('/api', convocatoriaRoutes);
app.use('/api', areaRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', tutorRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('<title>O! SANSI API</title><h1>API REST para O! SANSI Olympiad Registry</h1>');
});

// Middleware de manejo de errores (debe ser el último middleware)
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Servidor escuchando en: ${port}`);
});
