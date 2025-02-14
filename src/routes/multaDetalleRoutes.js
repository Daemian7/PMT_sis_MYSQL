const express = require("express");
const router = express.Router();
const multaDetalleController = require("../controllers/multaDetalleController");

// Crear un nuevo detalle de multa
router.post("/", multaDetalleController.createMultaDetalle);

// Obtener todos los detalles de multas
router.get("/", multaDetalleController.getMultaDetalles);

// Obtener un detalle de multa por ID
router.get("/:id", multaDetalleController.getMultaDetalleById);

// Actualizar un detalle de multa
router.put("/:id", multaDetalleController.updateMultaDetalle);

module.exports = router;
