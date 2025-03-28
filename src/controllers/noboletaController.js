const db = require("../db/db"); // Importar la conexión a la BD

exports.buscarBoleta = async (req, res) => {
    try {
        const { no_boleta } = req.body;

        if (!no_boleta) {
            return res.status(400).json({ error: "El número de boleta es requerido." });
        }

        const query = `
            SELECT BV.no_boleta, p.placa_inicial, BV.placa_cod, v.nombre AS tipo_vehiculo, BV.nit_prop, BV.id_boleta,
                   BV.tarjeta_circ, BV.marca, BV.color, l.tipo_licen, BV.no_licencia,
                   BV.dpi, e.ubicacion, BV.nombre, es.estado, DATE_FORMAT(ib.fecha, '%d/%m/%Y') AS fecha,
                   SUM(a.precio) AS total_precio
            FROM boleta_vehiculo BV
            INNER JOIN placa p ON p.id_placa = BV.tipo_placa
            INNER JOIN vehiculos v ON v.id_vehiculo = BV.id_vehiculo
            INNER JOIN extendida e ON e.id_exten = BV.extendida
            INNER JOIN boleta_final bf ON bf.id_boleta = BV.id_boleta
            INNER JOIN estados es ON es.id_estado = bf.estado
            INNER JOIN licencia l ON l.id_licen = BV.tipo_licencia
            INNER JOIN multa m ON m.id_boleta = BV.id_boleta
            INNER JOIN multa_detalle dm ON dm.id_multa = m.id_multa
            INNER JOIN articulos a ON a.id_artic = dm.id_articulo
            INNER JOIN info_boleta ib ON ib.id_boleta = BV.id_boleta
            WHERE BV.no_boleta = ?
            GROUP BY BV.no_boleta, p.placa_inicial, BV.placa_cod, v.nombre, BV.nit_prop, BV.id_boleta,
                     BV.tarjeta_circ, BV.marca, BV.color, l.tipo_licen, BV.no_licencia,
                     BV.dpi, e.ubicacion, BV.nombre, es.estado, ib.fecha;
        `;

         const [rows] = await db.query(query, [no_boleta]);
                res.json(rows);
            } catch (error) {
                console.error("Error en la consulta:", error);
                res.status(500).json({ error: "Error al realizar la búsqueda" });
            }
};
