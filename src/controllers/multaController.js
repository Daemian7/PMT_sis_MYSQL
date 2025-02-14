const db = require("../db/db"); // Asegúrate de que la conexión usa mysql2/promise

module.exports = {
    // Crear una nueva multa
    createMulta: async (req, res) => {
        try {
            const { id_boleta, total } = req.body;
            const query = "CALL sp_InsertMulta(?, ?);";
            const [rows] = await db.execute(query, [id_boleta, total]);
            res.status(201).json({ message: "Multa creada", newMultaId: rows[0][0].NewMultaId });
        } catch (err) {
            res.status(500).json({ error: "Error al insertar multa", details: err.message });
        }
    },

    // Obtener todas las multas
    getMultas: async (req, res) => {
        try {
            const query = "CALL sp_GetMultas();";
            const [rows] = await db.execute(query);
            res.status(200).json(rows[0]);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener multas", details: err.message });
        }
    },

    // Obtener una multa por ID
    getMultaById: async (req, res) => {
        try {
            const { id_multa } = req.params;
            const query = "CALL sp_GetMultaById(?);";
            const [rows] = await db.execute(query, [id_multa]);
            if (rows[0].length === 0) {
                return res.status(404).json({ message: "Multa no encontrada" });
            }
            res.status(200).json(rows[0][0]);
        } catch (err) {
            res.status(500).json({ error: "Error al obtener multa", details: err.message });
        }
    },

    // Actualizar una multa
    updateMulta: async (req, res) => {
        try {
            const { id_multa } = req.params;
            const { id_boleta, total } = req.body;
            const query = "CALL sp_UpdateMulta(?, ?, ?);";
            await db.execute(query, [id_multa, id_boleta, total]);
            res.status(200).json({ message: "Multa actualizada" });
        } catch (err) {
            if (err.message.includes("No se encontró")) {
                return res.status(404).json({ error: "Multa no encontrada" });
            }
            res.status(500).json({ error: "Error al actualizar multa", details: err.message });
        }
    },

    // Agregar una nueva multa automáticamente
    agregarMulta: async (req, res) => {
        try {
            const { total } = req.body;
            const query = "CALL sp_AddMulta(?);";
            const [rows] = await db.execute(query, [total]);
            res.status(201).json({ message: "Multa insertada correctamente", id_multa: rows[0][0].NuevoID });
        } catch (err) {
            res.status(500).json({ error: "Error al insertar la multa", details: err.message });
        }
    },
};
