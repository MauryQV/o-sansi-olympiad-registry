const express = require('express');
const { inscribir } = require('../controllers/inscriptionController');

const router = express.Router();

router.post('/inscribir', inscribir);

module.exports = router;
