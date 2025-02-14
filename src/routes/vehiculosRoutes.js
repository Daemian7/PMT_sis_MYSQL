const express = require("express");
const router = express.Router();
const vehiculosController = require("../controllers/vehiculosController");

// Rutas CRUD
router.post("/", vehiculosController.createVehiculo); // Crear vehículo
router.get("/", vehiculosController.getVehiculos); // Obtener todos los vehículos
router.get("/:id_vehiculo", vehiculosController.getVehiculoById); // Obtener vehículo por ID
router.put("/:id_vehiculo", vehiculosController.updateVehiculo); // Actualizar vehículo
router.delete("/:id_vehiculo", vehiculosController.deleteVehiculo); // Eliminar vehículo

module.exports = router;
