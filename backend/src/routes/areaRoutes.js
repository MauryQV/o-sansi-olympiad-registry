const express = require('express');
const router = express.Router();
const { getAreas, createArea } = require('../controllers/areaController');

router.get('/area', getAreas);
router.post('/area', createArea);

module.exports = router;