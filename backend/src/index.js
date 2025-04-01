const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT;

//app.use(errorHandler);
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());


app.get('/', (req, res) => {
    res.send('<html> <title>PAGINA 1</title> <h1 class="Loquesea">hola</h1></html>')
})




app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
})