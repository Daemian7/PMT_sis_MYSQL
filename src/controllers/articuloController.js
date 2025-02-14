const db = require("../db/db");

module.exports = {
    // Crear un nuevo artículo
    createArticulo: async (req, res) => {
        try {
            const { numero_artic, detalle, precio } = req.body;
            const [rows] = await db.query("CALL sp_InsertarArticulo(?, ?, ?)", [numero_artic, detalle, precio]);

            const id_artic = rows?.[0]?.[0]?.id_artic; // Extraer el ID del artículo

            if (!id_artic) {
                return res.status(500).json({ error: "No se pudo obtener el ID del artículo creado" });
            }

            res.status(201).json({ message: "Artículo creado", id: id_artic });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar artículo", details: error.message });
        }
    },

    // Obtener todos los artículos
    obtenerArticulos: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM articulos");
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener artículos");
        }
    },

    // Actualizar un artículo
    updateArticulo: async (req, res) => {
        try {
            const { id } = req.params;
            const { numero_artic, detalle, precio } = req.body;

            const [result] = await db.query("CALL sp_ActualizarArticulo(?, ?, ?, ?)", [id, numero_artic, detalle, precio]);

            const filas_actualizadas = result?.[0]?.[0]?.filas_actualizadas || 0;
            if (filas_actualizadas === 0) {
                return res.status(404).json({ message: "Artículo no encontrado" });
            }

            res.status(200).json({ message: "Artículo actualizado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar artículo", details: error.message });
        }
    },

    // Eliminar un artículo
    deleteArticulo: async (req, res) => {
        try {
            const { id } = req.params;

            await db.query("CALL sp_EliminarArticulo(?)", [id]);

            res.status(200).json({ message: "Artículo eliminado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar artículo", details: error.message });
        }
    },
};
