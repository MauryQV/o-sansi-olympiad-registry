import express from 'express'
import "dotenv/config";
const app = express();
app.use(express.json());
import authRoutes from './routes/authRoutes.js'
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('<title>XDDDDDD</title><h1>hello</h1>');
});

app.use('/api', authRoutes);


app.listen(port, () => {
    console.log(`Servidor escuchando en: ${port}`);
});
