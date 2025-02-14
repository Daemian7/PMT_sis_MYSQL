const express = require("express");
const router = express.Router();
const estadoController = require("../controllers/estadoController");

// Rutas CRUD para "estados"
router.post("/", estadoController.createEstado); // Crear un estado
router.get("/", estadoController.getAllEstados); // Obtener todos los estados
router.put("/:id_estado", estadoController.updateEstado); // Actualizar un estado

module.exports = router;
