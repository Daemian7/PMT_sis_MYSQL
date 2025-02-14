const express = require("express");
const router = express.Router();
const { buscarBoletas, generarPDF } = require("../controllers/conductorController");

router.get("/buscar-boletas", buscarBoletas);
router.get("/generar-pdf", generarPDF);

module.exports = router;
