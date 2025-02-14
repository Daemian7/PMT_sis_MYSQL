const db = require("../db/db");

module.exports = {
    // Crear una nueva infracción
    createInfraccion: async (req, res) => {
        try {
            const { tipo_infrac } = req.body;
            const [result] = await db.query("INSERT INTO infraccion (tipo_infrac) VALUES (?)", [tipo_infrac]);

            res.status(201).json({ message: "Infracción creada", newInfraccionId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar infracción", details: error.message });
        }
    },

    // Obtener todas las infracciones
    getInfracciones: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM infraccion");
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener infracciones", details: error.message });
        }
    },

    // Obtener una infracción por ID
    getInfraccionById: async (req, res) => {
        try {
            const { id_ifrac } = req.params;
            const [rows] = await db.query("SELECT * FROM infraccion WHERE id_ifrac = ?", [id_ifrac]);

            if (rows.length === 0) {
                return res.status(404).json({ message: "Infracción no encontrada" });
            }

            res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener infracción", details: error.message });
        }
    },

    // Actualizar una infracción
    updateInfraccion: async (req, res) => {
        try {
            const { id_ifrac } = req.params;
            const { tipo_infrac } = req.body;

            const [result] = await db.query("UPDATE infraccion SET tipo_infrac = ? WHERE id_ifrac = ?", [tipo_infrac, id_ifrac]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Infracción no encontrada" });
            }

            res.status(200).json({ message: "Infracción actualizada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar infracción", details: error.message });
        }
    },

    // Eliminar una infracción
    deleteInfraccion: async (req, res) => {
        try {
            const { id_ifrac } = req.params;
            const [result] = await db.query("DELETE FROM infraccion WHERE id_ifrac = ?", [id_ifrac]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Infracción no encontrada" });
            }

            res.status(200).json({ message: "Infracción eliminada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar infracción", details: error.message });
        }
    },
};
