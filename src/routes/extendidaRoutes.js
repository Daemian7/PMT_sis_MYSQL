const express = require("express");
const router = express.Router();
const extendidaController = require("../controllers/extendidaController");

// Rutas CRUD para "extendida"
router.post("/", extendidaController.createExtendida); // Crear una extendida
router.get("/", extendidaController.getExtendidas); // Obtener todas las extendidas
router.get("/:id_exten", extendidaController.getExtendidaById); // Obtener una extendida por ID
router.put("/:id_exten", extendidaController.updateExtendida); // Actualizar una extendida
router.delete("/:id_exten", extendidaController.deleteExtendida); // Eliminar una extendida

module.exports = router;
