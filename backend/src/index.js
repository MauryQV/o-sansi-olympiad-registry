import express from 'express'
import "dotenv/config";
const app = express();
app.use(express.json());
import authRoutes from './routes/authRoutes.js'
import convocatoriaRoutes from './routes/convocatoriaRoutes.js';
import areaRoutes from './routes/areaRoutes.js';
import categoriaRoutes from './routes/categoriaRoutes.js';

import locationRoutes from './routes/locationRoutes.js';


const port = process.env.PORT;


app.use('/api', authRoutes);
app.use('/api', convocatoriaRoutes);
app.use('/api', areaRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', locationRoutes);

app.get('/', (req, res) => {
    res.send('<title>XDDDDDD</title><h1>hello</h1>');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en: ${port}`);
});
