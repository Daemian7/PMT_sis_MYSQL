const db = require("../db/db");

module.exports = {
    // Crear una nueva firma
    createFirma: async (req, res) => {
        try {
            const { tipo_firma } = req.body;
            const [result] = await db.query("INSERT INTO firma (tipo_firma) VALUES (?)", [tipo_firma]);

            res.status(201).json({ message: "Firma creada", id_firma: result.insertId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar firma", details: error.message });
        }
    },

    // Obtener todas las firmas
    getFirmas: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM firma");
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener firmas", details: error.message });
        }
    },

    // Obtener una firma por ID
    getFirmaById: async (req, res) => {
        try {
            const { id_firma } = req.params;
            const [rows] = await db.query("SELECT * FROM firma WHERE id_firma = ?", [id_firma]);

            if (rows.length === 0) {
                return res.status(404).json({ message: "Firma no encontrada" });
            }

            res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener firma", details: error.message });
        }
    },

    // Actualizar una firma
    updateFirma: async (req, res) => {
        try {
            const { id_firma } = req.params;
            const { tipo_firma } = req.body;

            const [result] = await db.query("UPDATE firma SET tipo_firma = ? WHERE id_firma = ?", [tipo_firma, id_firma]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Firma no encontrada" });
            }

            res.status(200).json({ message: "Firma actualizada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar firma", details: error.message });
        }
    },

    // Eliminar una firma
    deleteFirma: async (req, res) => {
        try {
            const { id_firma } = req.params;
            const [result] = await db.query("DELETE FROM firma WHERE id_firma = ?", [id_firma]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Firma no encontrada" });
            }

            res.status(200).json({ message: "Firma eliminada" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar firma", details: error.message });
        }
    },
};
