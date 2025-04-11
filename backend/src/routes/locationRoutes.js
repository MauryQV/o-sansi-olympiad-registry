import express from 'express';
import * as locationController from '../controllers/locationController.js';

const router = express.Router();

router.get('/departamentos', locationController.getAllLocations);