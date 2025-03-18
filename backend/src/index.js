const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(errorHandler);

app.use('/api', userRoutes);
app.use('/api', fileRoutes);


app.get('/', (req, res) => {
    res.send('<html> <title>PAGINA 1</title> <h1 class="Loquesea">hola</h1></html>')
})




app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
})