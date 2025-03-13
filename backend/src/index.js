const express = require('express')
const app = express()
const port = 4000

app.get('/', (req, res) => {
    res.send('<html> <tittle>PAGINA 1</tittle> <h1 class="Loquesea">hola</h1></html>')
})



app.listen(port, () => {
    console.log(`puerto iniciado en:  ${port}`)
    //puerto 3k 
})