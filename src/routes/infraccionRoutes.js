const express = require("express");
const router = express.Router();
const infraccionController = require("../controllers/infraccionController");

// Rutas CRUD para "infracción"
router.post("/", infraccionController.createInfraccion); // Crear una infracción
router.get("/", infraccionController.getInfracciones); // Obtener todas las infracciones
router.get("/:id_ifrac", infraccionController.getInfraccionById); // Obtener una infracción por ID
router.put("/:id_ifrac", infraccionController.updateInfraccion); // Actualizar una infracción
router.delete("/:id_ifrac", infraccionController.deleteInfraccion); // Eliminar una infracción

module.exports = router;
