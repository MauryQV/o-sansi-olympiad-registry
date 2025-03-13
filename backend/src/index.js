const express = require('express')
const app = express()
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const port = 4000

app.use(express.json());

app.use('/api', userRoutes);


app.use(errorHandler);


app.get('/', (req, res) => {
    res.send('<html> <tittle>PAGINA 1</tittle> <h1 class="Loquesea">hola</h1></html>')
})



app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
    //puerto 3k 
})