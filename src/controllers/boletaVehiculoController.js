const db = require("../db/db");

const insertBoleta = async (req, res) => {
    try {
        const {
            tipo_placa, placa_cod, id_vehiculo, nit_prop, tarjeta_circ, marca, color,
            tipo_licencia, no_licencia, dpi, extendida, nombre, no_boleta
        } = req.body;

        const query = `CALL InsertarBoletaVehiculo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [tipo_placa, placa_cod, id_vehiculo, nit_prop, tarjeta_circ, marca, color,
            tipo_licencia, no_licencia, dpi, extendida, nombre, no_boleta];

        const [result] = await db.execute(query, params);

        res.status(201).json({
            message: "Boleta insertada correctamente",
            result,
        });
    } catch (error) {
        console.error("Error al insertar la boleta:", error.message);
        res.status(500).json({ message: "Error al insertar la boleta", error: error.message });
    }
};

const getBoletas = async (req, res) => {
    try {
        const { id_boleta } = req.query;
        const query = id_boleta ? "CALL sp_ObtenerBoletasVehiculo(?)" : "CALL sp_ObtenerBoletasVehiculo()";
        const params = id_boleta ? [id_boleta] : [];
        
        const [result] = await db.execute(query, params);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener boletas:", error.message);
        res.status(500).json({ message: "Error al obtener boletas", error: error.message });
    }
};

const updateBoleta = async (req, res) => {
    try {
        const {
            id_boleta, tipo_placa, placa_cod, id_vehiculo, nit_prop, tarjeta_circ, marca,
            color, tipo_licencia, no_licencia, dpi, extendida, nombre, no_boleta
        } = req.body;

        const query = `CALL sp_ActualizarBoletaVehiculo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [id_boleta, tipo_placa, placa_cod, id_vehiculo, nit_prop, tarjeta_circ, marca,
            color, tipo_licencia, no_licencia, dpi, extendida, nombre, no_boleta];

        const [result] = await db.execute(query, params);
        res.status(200).json({ filas_actualizadas: result.affectedRows });
    } catch (error) {
        console.error("Error al actualizar la boleta:", error.message);
        res.status(500).json({ message: "Error al actualizar la boleta", error: error.message });
    }
};

module.exports = { insertBoleta, getBoletas, updateBoleta };
