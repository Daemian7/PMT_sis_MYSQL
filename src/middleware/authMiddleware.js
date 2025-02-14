module.exports = (req, res, next) => {
    // Verificar si el ID de sesión (o un token) está presente en la solicitud
    const idSess = req.headers['x-session-id'];

    if (!idSess) {
        return res.status(401).json({ error: "No autorizado. Inicia sesión primero." });
    }

    // Verificar si la sesión existe en la base de datos
    const query = "SELECT * FROM session_init WHERE id_sess = ?";
    db.query(query, [idSess], (err, rows) => {
        if (err) {
            console.error("Error al verificar sesión:", err.message);
            return res.status(500).json({ error: "Error al verificar la sesión" });
        }

        if (rows.length === 0) {
            return res.status(401).json({ error: "Sesión no válida" });
        }

        // Si la sesión es válida, continuar con la solicitud
        req.user = rows[0]; // Opcional: Agregar información del usuario a la solicitud
        next();
    });
};