const express = require('express');
const router = express.Router();
const { getCategorias, createCategoria } = require('../controllers/categoriaController');

router.get('/categoria', getCategorias);
router.post('/categoria', createCategoria);

module.exports = router;