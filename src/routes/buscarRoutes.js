const express = require("express");
const router = express.Router();
const boletasController = require("../controllers/buscarController");

router.post("/", boletasController.buscarBoletas);
router.get("/generar-pdf", boletasController.generarPDF);

module.exports = router;
