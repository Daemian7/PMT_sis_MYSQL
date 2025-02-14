const express = require("express");
const router = express.Router();
const placasController = require("../controllers/placasController");

router.post("/", placasController.insertPlaca);
router.get("/", placasController.getPlacas);
router.get("/:id", placasController.getPlacas); // Reutiliza el mismo controlador para un ID específico
router.put("/:id", placasController.updatePlaca);
module.exports = router;

