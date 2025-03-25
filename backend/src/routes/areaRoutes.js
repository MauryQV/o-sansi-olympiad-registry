const express = require('express');
const router = express.Router();
const { createArea } = require('../controllers/areaController');

router.post('/area', createArea);

module.exports = router;
