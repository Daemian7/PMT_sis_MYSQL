const db = require("../db/db"); // db es el pool promisificado

const eliminarBoleta = async (req, res) => {
    const { id_boleta, no_recibo } = req.body;
    let connection;

    try {
        // Usa db.getConnection() directamente
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Verifica si el número de recibo ya existe en boleta_eliminada
        const checkQuery = `SELECT COUNT(*) AS count FROM boleta_eliminada WHERE no_recibo = ?;`;
        const [rows] = await connection.execute(checkQuery, [no_recibo]);

        if (rows[0].count > 0) {
            // Si el número de recibo ya existe, se revierte la transacción y se responde con un error
            await connection.rollback();
            return res.status(400).json({ error: 'El número de recibo ya existe.' });
        }

        // Inserta en boleta_eliminada
        const insertQuery = `
           INSERT INTO boleta_eliminada (id_boleta, id_info_boleta, id_multa, no_recibo, fecha_elim)
SELECT id_boleta, id_info_boleta, id_multa, ?, NOW()
FROM boleta_final
WHERE id_boleta = ?;
        `;
        await connection.execute(insertQuery, [no_recibo, id_boleta]);

        // Elimina la boleta de boleta_final
        const deleteQuery = `DELETE FROM boleta_final WHERE id_boleta = ?;`;
        await connection.execute(deleteQuery, [id_boleta]);

        await connection.commit();
        res.json({ message: 'Boleta eliminada y transferida exitosamente.' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Error en la transacción:", error);
        res.status(500).json({ error: 'Error al eliminar la boleta.' });
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { eliminarBoleta };
