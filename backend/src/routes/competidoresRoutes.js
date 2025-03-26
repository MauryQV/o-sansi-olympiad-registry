const express = require('express');
const { 
    getAllCompetidores, 
    getCompetidorById, 
    createCompetidor, 
    deleteCompetidor,
    buscarCompetidores 
} = require('../controllers/competidoresController');
const { 
    validarDatosCompetidor, 
    verificarCompetidorDuplicado 
} = require('../middleware/competidoresMiddleware');

const router = express.Router();

// Rutas GET
router.get('/competidores', getAllCompetidores);
router.get('/competidores/:id', getCompetidorById);
router.get('/buscar/competidores', buscarCompetidores);

// Ruta POST con validaciones
router.post('/competidores', validarDatosCompetidor, verificarCompetidorDuplicado, createCompetidor);

// Ruta DELETE
router.delete('/competidores/:id', deleteCompetidor);

module.exports = router; 