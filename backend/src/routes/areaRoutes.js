const express = require('express');
const router = express.Router();
const { crearArea } = require('../controllers/areaController');

router.post('/area', crearArea);

module.exports = router;
