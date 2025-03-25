const express = require('express');
const { getDepartamentos, getProvincias, getColegios } = require('../controllers/locationController');

const router = express.Router();

router.get('/departamentos', getDepartamentos);
router.get('/provincias/:id_departamento', getProvincias);
router.get('/escuelas/:id_provincia', getColegios);

module.exports = router;
