const express = require("express");
const router = express.Router();
const trasladoController = require("../controllers/trasladoController");

router.get("/generarPDF", trasladoController.generarPDF);

module.exports = router;
