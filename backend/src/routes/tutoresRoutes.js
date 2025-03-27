const express = require('express');
const { getAllTutores, getTutorById, createTutor, deleteTutor, buscarTutoresController } = require('../controllers/tutoresController.js');
const { verificarDuplicado, validarDatosTutor } = require('../middleware/tutoresMiddleware');

const router = express.Router();


router.get('/tutores', getAllTutores);
router.get('/tutores/:id', getTutorById);

router.post('/tutores', validarDatosTutor, verificarDuplicado, createTutor);

router.delete('/:id', deleteTutor);

router.get('/buscar', buscarTutoresController);

module.exports = router;