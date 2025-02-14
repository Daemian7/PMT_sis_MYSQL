const express = require('express');
const router = express.Router();
const boletasController = require("../controllers/boletasController");

router.post("/", boletasController.insertBoleta);  // Insertar boleta
router.get("/", boletasController.getBoletas);  // Obtener boletas
router.put("/:id", boletasController.updateBoleta);  // Actualizar boleta


module.exports = router;
