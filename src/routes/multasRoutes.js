const express = require('express');
const router = express.Router();
const multaController = require('../controllers/multasController');

// Ruta para agregar un detalle de multa y actualizar el total
// router.post('/detalle', multaController.agregarDetalleYActualizarTotal);
router.put('/detalle/:id', multaController.actualizarDetalleYActualizarTotal);
router.get('/detalle/:id_multa', multaController.obtenerDetallesMulta);
router.post('/', multaController.agregarMultaDetalle);
// router.post('/insert', multaController.insertarMultaConDetalles);
module.exports = router;