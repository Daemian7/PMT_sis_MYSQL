// backend/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const login = (req, res) => {
    const { username, password } = req.body;

    // Aquí deberías verificar las credenciales contra tu base de datos
    const user = { id: 1, username: "admin" }; // Simulación de usuario
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
};

module.exports = { login };
