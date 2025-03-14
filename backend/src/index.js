const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes');
const competidorRoutes = require('./routes/competidorRoutes');
const errorHandler = require('./middleware/errorHandler');
const port = process.env.PORT;
app.use(express.json());
app.use(errorHandler);

app.use('/api', userRoutes);
app.use('/api', competidorRoutes);


app.get('/', (req, res) => {
    res.send('<html> <title>PAGINA 1</title> <h1 class="Loquesea">hola</h1></html>')
})

app.get('/about', (req, res) => {
    res.send('<title>About</title> <h1> SOBRE NOSOTROS </h1>')
})


app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
})