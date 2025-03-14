const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { subirExcel } = require('../controllers/competidorController');

//ruta de la api
router.post('/excel', upload.single('archivo'), subirExcel);

module.exports = router;