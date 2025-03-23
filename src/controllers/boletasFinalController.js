const db = require("../db/db");

// Insertar una boleta final
const insertBoletaFinal = async (req, res) => {
    try {
        const { vencimiento } = req.body;

        if (!vencimiento) {
            return res.status(400).json({ message: "La fecha de vencimiento es obligatoria" });
        }

        const query = "CALL sp_InsertBoletaFinal(?)";
        await db.execute(query, [vencimiento]);

        res.status(201).json({ message: "Boleta final insertada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al insertar la boleta final", error: error.message });
    }
};

// Obtener boletas
const getBoletas = async (req, res) => {
    try {
        const query = `
 SELECT 
    BV.id_boleta,
    BV.no_boleta, 
    p.placa_inicial, 
    BV.placa_cod, 
    v.nombre AS tipo_vehiculo, 
    BV.nit_prop, 
    BV.tarjeta_circ, 
    BV.marca, 
    BV.color, 
    l.tipo_licen, 
    BV.no_licencia, 
    BV.dpi, 
    e.ubicacion, 
    BV.nombre, 
    es.estado,
    DATE_FORMAT(ib.fecha, '%d/%m/%Y') AS fecha,
    SUM(a.precio) AS total_precio -- SUMAMOS EL PRECIO DE LOS ARTÍCULOS POR BOLETA
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
GROUP BY 
    BV.id_boleta,  -- Se agregó para corregir el error
    BV.no_boleta, 
    p.placa_inicial, 
    BV.placa_cod, 
    v.nombre, 
    BV.nit_prop, 
    BV.tarjeta_circ, 
    BV.marca, 
    BV.color, 
    l.tipo_licen, 
    BV.no_licencia, 
    BV.dpi, 
    e.ubicacion, 
    BV.nombre, 
    es.estado,
    ib.fecha  -- Se agregó para corregir el error
ORDER BY BV.no_boleta ASC;
        `;

        const [result] = await db.execute(query);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener boletas:", error);
        res.status(500).json({ error: error.message });
    }
};



// Actualizar estado de una boleta final
const updateEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!id || !estado) {
            return res.status(400).json({ error: "ID y estado son obligatorios" });
        }

        const query = "UPDATE boleta_final SET estado = ? WHERE id_boletafin = ?";
        const [result] = await db.execute(query, [estado, id]);

        res.json({ message: "Estado actualizado correctamente", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("Error al actualizar estado:", error);
        res.status(500).json({ error: "Error al actualizar el estado", details: error.message });
    }
};

module.exports = {
    insertBoletaFinal,
    getBoletas,
    updateEstado,
};
