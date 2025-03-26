const express = require('express');
const { inscribir } = require('../controllers/inscriptionController');
const { verificarCompetidor } = require('../middleware/inscripcionMiddleware');
const router = express.Router();

router.post('/inscribir', verificarCompetidor, inscribir);

module.exports = router;
