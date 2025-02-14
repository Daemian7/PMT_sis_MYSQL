const express = require("express");
const router = express.Router();
const firmaController = require("../controllers/firmaController");

// Rutas CRUD para "firma"
router.post("/", firmaController.createFirma); // Crear una firma
router.get("/", firmaController.getFirmas); // Obtener todas las firmas
router.get("/:id_firma", firmaController.getFirmaById); // Obtener una firma por ID
router.put("/:id_firma", firmaController.updateFirma); // Actualizar una firma

module.exports = router;
