const db = require("../db/db");

module.exports = {
    // Insertar una nueva placa
    insertPlaca: async (req, res) => {
        try {
            const { placa, placa_inicial } = req.body;
            const [result] = await db.query(
                "INSERT INTO placa (placa, placa_inicial) VALUES (?, ?)",
                [placa, placa_inicial]
            );

            res.status(201).json({ message: "Placa creada", id_placa: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar placa", details: error.message });
        }
    },

    // Obtener todas las placas o una placa por ID
    getPlacas: async (req, res) => {
        try {
            const { id } = req.params;
            const query = id
                ? "SELECT * FROM placa WHERE id_placa = ?"
                : "SELECT * FROM placa";
            const params = id ? [id] : [];

            const [rows] = await db.query(query, params);

            if (id && rows.length === 0) {
                return res.status(404).json({ message: "Placa no encontrada" });
            }

            res.status(200).json(id ? rows[0] : rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener placas", details: error.message });
        }
    },

    // Actualizar una placa
    updatePlaca: async (req, res) => {
        try {
            const { id } = req.params;
            const { placa, placa_inicial } = req.body;

            const [result] = await db.query(
                "UPDATE placa SET placa = ?, placa_inicial = ? WHERE id_placa = ?",
                [placa, placa_inicial, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Placa no encontrada" });
            }

            res.status(200).json({ message: "Placa actualizada correctamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar placa", details: error.message });
        }
    },

    // Eliminar una placa
    deletePlaca: async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await db.query("DELETE FROM placa WHERE id_placa = ?", [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Placa no encontrada" });
            }

            res.status(200).json({ message: "Placa eliminada correctamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar placa", details: error.message });
        }
    },
};
