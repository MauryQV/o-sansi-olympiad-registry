const express = require('express')
const app = express()
const fileRoutes = require('./routes/fileRoutes');
const tutorRoutes = require('./routes/tutoresRoutes');
const areaRoutes = require('./routes/areaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes')
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(errorHandler);

app.use('/api', fileRoutes);
app.use('/api', tutorRoutes);
app.use('/api', areaRoutes);
app.use('/api', categoriaRoutes);



app.get('/', (req, res) => {
    res.send('<html> <title>PAGINA 1</title> <h1 class="Loquesea">hola</h1></html>')
})




app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
})