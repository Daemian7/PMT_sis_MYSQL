const db = require("../db/db");

module.exports = {
    // Crear un nuevo detalle de multa
    createMultaDetalle: (req, res) => {
        const { id_multa, id_articulo } = req.body;

        const query = "INSERT INTO multa_detalle (id_multa, id_articulo) VALUES (?, ?)";
        db.query(query, [id_multa, id_articulo], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al insertar detalle de multa", details: err.message });
            }
            res.status(201).json({ 
                message: "Detalle de multa creado", 
                newDetalleId: result.insertId || null // Devuelve el ID del nuevo detalle, si lo hay
            });
        });
    },

    // Obtener todos los detalles de multas
    getMultaDetalles: (req, res) => {
        const query = "SELECT * FROM multa_detalle";
        db.query(query, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Error al obtener detalles de multas", details: err.message });
            }
            res.status(200).json(rows);
        });
    },

    // Obtener un detalle de multa por ID
    getMultaDetalleById: (req, res) => {
        const { id_detalle } = req.params;

        const query = "SELECT * FROM multa_detalle WHERE id_detalle = ?";
        db.query(query, [id_detalle], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Error al obtener detalle de multa", details: err.message });
            }
            if (rows.length === 0) {
                return res.status(404).json({ message: "Detalle de multa no encontrado" });
            }
            res.status(200).json(rows[0]);
        });
    },

    // Actualizar un detalle de multa
    updateMultaDetalle: (req, res) => {
        const { id_detalle } = req.params;
        const { id_multa, id_articulo } = req.body;

        const query = "UPDATE multa_detalle SET id_multa = ?, id_articulo = ? WHERE id_detalle = ?";
        db.query(query, [id_multa, id_articulo, id_detalle], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al actualizar detalle de multa", details: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Detalle de multa no encontrado" });
            }
            res.status(200).json({ message: "Detalle de multa actualizado" });
        });
    },
};
