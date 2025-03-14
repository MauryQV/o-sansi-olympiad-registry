const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes');
const competidorRoutes = require('./routes/competidorRoutes');
const errorHandler = require('./middleware/errorHandler');
const port = process.env.PORT;

app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', competidorRoutes);

app.use(errorHandler);


app.get('/', (req, res) => {
    res.send('<html> <title>PAGINA 1</title> <h1 class="Loquesea">hola</h1></html>')
})



app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
    //puerto 3k 
})