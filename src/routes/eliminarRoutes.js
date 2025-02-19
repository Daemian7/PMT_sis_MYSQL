const express = require('express');
const router = express.Router();
const { eliminarBoleta } = require('../controllers/eliminarController');

// Ruta para eliminar la boleta (transferirla a boleta_eliminada)
// Endpoint: POST /api/boletas/eliminar
router.post('/', eliminarBoleta);

module.exports = router;
