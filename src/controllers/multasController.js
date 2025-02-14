const db = require('../db/db'); // Asegúrate de que la ruta sea correcta

// Función para actualizar un detalle de multa existente y recalcular el total
const actualizarDetalleYActualizarTotal = async (req, res) => {
    const { id_detalle, id_articulo } = req.body;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Actualizar el detalle en la tabla multa_detalle
        const [result] = await connection.query(
            `UPDATE multa_detalle SET id_articulo = ? WHERE id_detalle = ?;`,
            [id_articulo, id_detalle]
        );

        if (result.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ error: "Detalle no encontrado" });
        }

        // Obtener el ID de la multa
        const [[multa]] = await connection.query(
            `SELECT id_multa FROM multa_detalle WHERE id_detalle = ?;`,
            [id_detalle]
        );

        if (!multa) {
            await connection.rollback();
            return res.status(500).json({ error: "Error al encontrar la multa relacionada" });
        }

        await connection.commit();
        res.status(200).json({ message: "Detalle actualizado y total recalculado correctamente" });
    } catch (err) {
        await connection.rollback();
        res.status(500).json({ error: "Error al actualizar el detalle de la multa", details: err.message });
    } finally {
        connection.release();
    }
};

// Función para obtener los detalles de una multa específica
const obtenerDetallesMulta = async (req, res) => {
    const id_multa = parseInt(req.params.id_multa, 10);

    if (isNaN(id_multa)) {
        return res.status(400).json({ error: "El ID de la multa debe ser un número válido" });
    }

    try {
        const [result] = await db.query(
            `SELECT md.id_detalle, md.id_articulo, a.detalle, a.precio
             FROM multa_detalle md
             INNER JOIN articulos a ON md.id_articulo = a.id_artic
             WHERE md.id_multa = ?;`,
            [id_multa]
        );

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: "Error al obtener los detalles de la multa", details: err.message });
    }
};

// Agregar un detalle de multa ejecutando el procedimiento almacenado
const agregarMultaDetalle = async (req, res) => {
    const { id_articulo } = req.body;

    if (!id_articulo) {
        return res.status(400).json({ error: "El campo 'id_articulo' es obligatorio." });
    }

    try {
        const [result] = await db.query("CALL sp_AddMultaDetalle(?);", [id_articulo]);
        res.status(201).json({ message: "Detalle de multa insertado correctamente", result });
    } catch (err) {
        res.status(500).json({ error: "Error al insertar el detalle de la multa", details: err.message });
    }
};

module.exports = {
    actualizarDetalleYActualizarTotal,
    obtenerDetallesMulta,
    agregarMultaDetalle
};
