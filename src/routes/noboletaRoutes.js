const express = require("express");
const router = express.Router();
const boletaController = require("../controllers/noboletaController");

// Definir la ruta para buscar boletas
router.post("/", boletaController.buscarBoleta);

module.exports = router;
