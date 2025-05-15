import { Router } from "express";
import * as pagoControllers from "../controllers/pagoController.js";
import { esCajero } from "../middlewares/permisoMiddleware.js";
import * as authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();
//solo el cajero puede ver todos los pagos pendientes 
router.get("/pagos-pendientes", authMiddleware.verificarToken, esCajero, pagoControllers.obtenerPagosPendientes);

router.patch("/validar-pago/:pagoId", authMiddleware.verificarToken, esCajero, pagoControllers.validarPago);
//rutas para el competidor
router.get("/mis-pagos-pendientes", authMiddleware.authMiddleware, pagoControllers.verMisPagosPendientes);

router.get("/detalle-pago/:pagoId", authMiddleware.authMiddleware, pagoControllers.verDetallePago);
//ruta para el cajero para buscar un pago por busqueda
router.get("/buscar-pago", authMiddleware.verificarToken, esCajero, pagoControllers.buscarPagos);

export default router;