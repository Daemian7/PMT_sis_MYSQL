const express = require("express");
const router = express.Router();
const licenciaController = require("../controllers/licenciaController");

// Rutas CRUD para "licencia"
router.post("/", licenciaController.createLicencia); // Crear una licencia
router.get("/", licenciaController.getLicencias); // Obtener todas las licencias
router.get("/:id_licen", licenciaController.getLicenciaById); // Obtener una licencia por ID
router.put("/:id_licen", licenciaController.updateLicencia); // Actualizar una licencia
router.delete("/:id_licen", licenciaController.deleteLicencia); // Eliminar una licencia

module.exports = router;
