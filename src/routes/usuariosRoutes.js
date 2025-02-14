const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController"); // Importa el controlador

// Define las rutas y asigna el controlador correspondiente
router.post("/", usuariosController.insertUsuario);
router.get("/", usuariosController.getUsuarios);
router.get("/:id", usuariosController.getUsuarioById);
router.put("/:id", usuariosController.updateUsuario);

module.exports = router;
