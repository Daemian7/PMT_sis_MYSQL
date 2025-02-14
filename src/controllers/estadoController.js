const db = require("../db/db");

module.exports = {
    // Crear un nuevo estado
    createEstado: (req, res) => {
        const { estado } = req.body;

        const query = "INSERT INTO estados (estado) VALUES (?)";
        db.query(query, [estado], (err) => {
            if (err) {
                return res.status(500).json({ error: "Error al insertar estado", details: err.message });
            }
            res.status(201).json({ message: "Estado creado" });
        });
    },

    // Obtener todos los estados
    getAllEstados: (req, res) => {
        const query = "SELECT * FROM estados";
        db.query(query, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: "Error al obtener estados", details: err.message });
            }
            res.status(200).json(rows);
        });
    },

    // Actualizar un estado
    updateEstado: (req, res) => {
        const { id_estado } = req.params;
        const { estado } = req.body;

        const query = "UPDATE estados SET estado = ? WHERE id_estado = ?";
        db.query(query, [estado, id_estado], (err) => {
            if (err) {
                return res.status(500).json({ error: "Error al actualizar estado", details: err.message });
            }
            res.status(200).json({ message: "Estado actualizado" });
        });
    },
};
