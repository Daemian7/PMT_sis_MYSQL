const express = require("express");
const router = express.Router();
const boletaVehiculoController = require("../controllers/boletaVehiculoController");

// Crear una nueva boleta de vehículo
router.post("/", boletaVehiculoController.insertBoleta);

// Obtener todas las boletas o una específica por ID
router.get("/:id?", boletaVehiculoController.getBoletas);

// Actualizar una boleta específica por ID
router.put("/:id", boletaVehiculoController.updateBoleta);

module.exports = router;
