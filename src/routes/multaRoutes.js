const express = require("express");
const router = express.Router();
const multaController = require("../controllers/multaController");

// Crear una nueva multa
router.post("/", multaController.createMulta);

// Obtener todas las multas
router.get("/", multaController.getMultas);

// Obtener una multa por ID
router.get("/:id", multaController.getMultaById);

// Actualizar una multa
router.put("/:id", multaController.updateMulta);

router.post("/insert", multaController.agregarMulta);

module.exports = router;