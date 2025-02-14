const db = require("../db/db");

module.exports = {
    // Crear una nueva licencia
    createLicencia: async (req, res) => {
        try {
            const { tipo_licen } = req.body;
            const [result] = await db.query("INSERT INTO licencia (tipo_licen) VALUES (?)", [tipo_licen]);

            res.status(201).json({ message: "Licencia creada", newLicenciaId: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar licencia", details: error.message });
        }
    },

    // Obtener todas las licencias
    getLicencias: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM licencia");
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener licencias", details: error.message });
        }
    },

    // Obtener una licencia por ID
    getLicenciaById: async (req, res) => {
        try {
            const { id_licen } = req.params;
            const [rows] = await db.query("SELECT * FROM licencia WHERE id_licen = ?", [id_licen]);

            if (rows.length === 0) {
                return res.status(404).json({ message: "Licencia no encontrada" });
            }

            res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener licencia", details: error.message });
        }
    },

    // Actualizar una licencia
    updateLicencia: async (req, res) => {
        try {
            const { id_licen } = req.params;
            const { tipo_licen } = req.body;

            const [result] = await db.query("UPDATE licencia SET tipo_licen = ? WHERE id_licen = ?", [tipo_licen, id_licen]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Licencia no encontrada" });
            }

            res.status(200).json({ message: "Licencia actualizada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar licencia", details: error.message });
        }
    },

    // Eliminar una licencia
    deleteLicencia: async (req, res) => {
        try {
            const { id_licen } = req.params;
            const [result] = await db.query("DELETE FROM licencia WHERE id_licen = ?", [id_licen]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Licencia no encontrada" });
            }

            res.status(200).json({ message: "Licencia eliminada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar licencia", details: error.message });
        }
    },
};
