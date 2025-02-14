const express = require("express");
const router = express.Router();
const articuloController = require("../controllers/articuloController");

// Crear un nuevo artículo
router.post("/", articuloController.createArticulo);

// Obtener todos los artículos
router.get("/", articuloController.obtenerArticulos);

// Actualizar un artículo
router.put("/:id", articuloController.updateArticulo);

// Eliminar un artículo
router.delete("/:id", articuloController.deleteArticulo);

module.exports = router;
