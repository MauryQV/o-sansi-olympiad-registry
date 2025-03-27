const express = require('express');
const router = express.Router();
const { createCategoria, getCategorias } = require('../controllers/categoriaController');

router.get('/categoria', getCategorias);
router.post('/categoria', createCategoria);

module.exports = router;
