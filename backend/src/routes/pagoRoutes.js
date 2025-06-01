import { Router } from "express";
import * as pagoControllers from "../controllers/pagoController.js";
import { esCajero } from "../middlewares/permisoMiddleware.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

// Rutas para el cajero
router.get("/pendientes", authMiddleware.verificarToken, esCajero, pagoControllers.obtenerPagosPendientes);
router.get("/realizados", authMiddleware.verificarToken, esCajero, pagoControllers.obtenerPagosRealizados);
router.get("/estadisticas", authMiddleware.verificarToken, esCajero, pagoControllers.obtenerEstadisticasPagos);
router.patch("/validar-pago/:pagoId", authMiddleware.verificarToken, esCajero, pagoControllers.validarPago);

// Rutas para el competidor
router.get("/mis-pagos-pendientes", authMiddleware.authMiddleware, pagoControllers.verMisPagosPendientes);

router.get("/detalle-pago/:pagoId", authMiddleware.authMiddleware, pagoControllers.verDetallePago);

// Ruta para el cajero para buscar un pago por búsqueda
router.get("/buscar-pago", authMiddleware.verificarToken, esCajero, pagoControllers.buscarPagos);

// Ruta para obtener todos los pagos del competidor
router.get('/competidor', authMiddleware.verificarToken, pagoControllers.obtenerPagosCompetidor);

export default router;