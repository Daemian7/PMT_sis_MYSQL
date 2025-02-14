const db = require("../db/db");

// Insertar una boleta
const insertBoleta = async (req, res) => {
  try {
    const { ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infrac } = req.body;

    const query = `CALL sp_AddInfoBoleta(?, ?, ?, ?, ?, ?, ?)`;
    const params = [ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infrac];

    const [result] = await db.execute(query, params);

    res.json({ message: "Boleta insertada correctamente", result });
  } catch (error) {
    console.error("Error al insertar boleta:", error);
    res.status(500).json({ error: "Error al insertar boleta", details: error.message });
  }
};

// Obtener boletas
const getBoletas = async (req, res) => {
  try {
    const query = "CALL sp_GetInfoBoletas()";
    const [result] = await db.execute(query);
    res.json(result);
  } catch (error) {
    console.error("Error al obtener boletas:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una boleta
const updateBoleta = async (req, res) => {
  try {
    const { id_info, ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infra, id_boleta } = req.body;
    const id = req.params.id;

    const query = `
      UPDATE boletas 
      SET id_info = ?, ubicacion = ?, fecha = ?, hora = ?, id_usuario = ?, observaciones = ?, id_firma = ?, id_infra = ?, id_boleta = ? 
      WHERE id_info = ?
    `;

    const params = [id_info, ubicacion, fecha, hora, id_usuario, observaciones, id_firma, id_infra, id_boleta, id];
    const [result] = await db.execute(query, params);

    res.json({ message: "Boleta actualizada correctamente", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Error al actualizar boleta:", error);
    res.status(500).json({ error: "Error al actualizar boleta", details: error.message });
  }
};

module.exports = {
  insertBoleta,
  getBoletas,
  updateBoleta,
};
