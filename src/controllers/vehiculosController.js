const db = require("../db/db");

module.exports = {
    // Crear un nuevo vehículo
    createVehiculo: async (req, res) => {
        try {
            const { nombre } = req.body;
            const [rows] = await db.query("CALL sp_InsertVehiculo(?)", [nombre]);
            res.status(201).json({ message: "Vehículo creado", newVehiculoId: rows[0].NewVehiculoId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al insertar vehículo", details: error.message });
        }
    },

    // Obtener todos los vehículos
    getVehiculos: async (req, res) => {
        try {
            const [rows] = await db.query("SELECT * FROM vehiculos");
            res.json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send("Error al obtener vehículos");
        }
    },

    // Obtener un vehículo por ID
    getVehiculoById: async (req, res) => {
        try {
            const { id_vehiculo } = req.params;
            const [rows] = await db.query("CALL sp_GetVehiculoById(?)", [id_vehiculo]);

            if (rows.length === 0 || !rows[0].length) {
                return res.status(404).json({ message: "Vehículo no encontrado" });
            }

            res.json(rows[0][0]); // Accedemos al primer elemento de la primera fila
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener vehículo", details: error.message });
        }
    },

    // Actualizar un vehículo
    updateVehiculo: async (req, res) => {
        try {
            const { id_vehiculo } = req.params;
            const { nombre } = req.body;

            await db.query("CALL sp_UpdateVehiculo(?, ?)", [id_vehiculo, nombre]);

            res.status(200).json({ message: "Vehículo actualizado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al actualizar vehículo", details: error.message });
        }
    },

    // Eliminar un vehículo
    deleteVehiculo: async (req, res) => {
        try {
            const { id_vehiculo } = req.params;

            await db.query("CALL sp_DeleteVehiculo(?)", [id_vehiculo]);

            res.status(200).json({ message: "Vehículo eliminado" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar vehículo", details: error.message });
        }
    },
};
