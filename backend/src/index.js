const express = require('express')
const app = express()
const fileRoutes = require('./routes/fileRoutes');
const tutorRoutes = require('./routes/tutoresRoutes');
const competidoresRoutes = require('./routes/competidoresRoutes');
const errorHandler = require('./middleware/errorHandler');
const locationRoutes = require('./routes/locationRoutes');
const areaRoutes = require('./routes/areaRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const cors = require('cors');
const port = process.env.PORT;
//app.use(errorHandler);
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());


app.use('/api', fileRoutes);
app.use('/api', tutorRoutes);
app.use('/api', competidoresRoutes);
app.use('/api', areaRoutes);
app.use('/api', categoriaRoutes);
app.use('/api', locationRoutes);





app.get('/', (req, res) => {
    res.send('<html> <title>PAGINA 1</title> <h1 class="Loquesea">hola</h1></html>')
})




app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
})