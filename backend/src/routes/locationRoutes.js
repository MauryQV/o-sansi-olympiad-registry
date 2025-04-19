import { Router } from "express";
import * as locationController from "../controllers/locationController.js";

const router = Router();

router.get("/departamentos", locationController.getDepartamentos);

router.get("/departamentos/:departamentoId/provincias", locationController.getProvinciasByDepartamento);

router.get("/provincias/:provinciaId/colegios", locationController.getColegiosByProvincia);

export default router;
