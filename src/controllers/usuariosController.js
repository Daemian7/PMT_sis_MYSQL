const db = require("../db/db"); // Importa la conexión a la base de datos MySQL

// Insertar un nuevo usuario
const insertUsuario = (req, res) => {
  const { name_user, chapa } = req.body;

  const query = "INSERT INTO usuarios (name_user, chapa) VALUES (?, ?)";
  const params = [name_user, chapa];

  db.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ newUserId: result.insertId });
  });
};

// Obtener todos los usuarios
async function getUsuarios(req, res) {
  try {
      const [rows] = await db.query("SELECT * FROM usuarios");
      res.json(rows);
  } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener usuarios");
  }
}

// Obtener un usuario por ID
const getUsuarioById = (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM usuarios WHERE id_user = ?";
  const params = [id];

  db.query(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(rows[0]);
  });
};

// Actualizar un usuario por ID
const updateUsuario = (req, res) => {
  const { id } = req.params;
  const { name_user, chapa } = req.body;

  const query = "UPDATE usuarios SET name_user = ?, chapa = ? WHERE id_user = ?";
  const params = [name_user, chapa, id];

  db.query(query, params, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado correctamente" });
  });
};

module.exports = {
  insertUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
};
