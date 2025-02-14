const express = require("express");
const router = express.Router();
const { insertBoletaFinal, getBoletas, updateEstado } = require("../controllers/boletasFinalController");

router.post("/", insertBoletaFinal);
router.get("/", getBoletas);
router.put("/:id", updateEstado);

module.exports = router;
