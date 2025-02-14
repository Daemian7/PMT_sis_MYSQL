const db = require("../db/db");

module.exports = {
    // Crear una nueva entrada extendida
    createExtendida: async (req, res) => {
        try {
            const { ubicacion } = req.body;
            const [result] = await db.query(
                "INSERT INTO extendida (ubicacion) VALUES (?)",
                [ubicacion]
            );

            res.status(201).json({ message: "Extendida creada", id_exten: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar extendida", details: error.message });
        }
    },

    // Obtener todas las entradas extendidas
    getExtendidas: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM extendida");
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener extendidas", details: error.message });
        }
    },

    // Obtener una entrada extendida por ID
    getExtendidaById: async (req, res) => {
        try {
            const { id_exten } = req.params;
            const [rows] = await db.query("SELECT * FROM extendida WHERE id_exten = ?", [id_exten]);

            if (rows.length === 0) {
                return res.status(404).json({ message: "Extendida no encontrada" });
            }

            res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener extendida", details: error.message });
        }
    },

    // Actualizar una entrada extendida
    updateExtendida: async (req, res) => {
        try {
            const { id_exten } = req.params;
            const { ubicacion } = req.body;

            const [result] = await db.query(
                "UPDATE extendida SET ubicacion = ? WHERE id_exten = ?",
                [ubicacion, id_exten]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Extendida no encontrada" });
            }

            res.status(200).json({ message: "Extendida actualizada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar extendida", details: error.message });
        }
    },

    // Eliminar una entrada extendida
    deleteExtendida: async (req, res) => {
        try {
            const { id_exten } = req.params;
            const [result] = await db.query("DELETE FROM extendida WHERE id_exten = ?", [id_exten]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Extendida no encontrada" });
            }

            res.status(200).json({ message: "Extendida eliminada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar extendida", details: error.message });
        }
    },
};
