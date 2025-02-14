const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");

// Rutas CRUD para "session"
router.post("/", sessionController.createSession); // Crear sesión (registro)
router.get("/:id_sess", sessionController.getSession); // Obtener sesión por ID
router.put("/:id_sess", sessionController.updateSession); // Actualizar sesión
router.post("/login", sessionController.login); // Inicio de sesión (login)

module.exports = router;
