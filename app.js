const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Importa las rutas
const usuariosRoutes = require("./src/routes/usuariosRoutes");
const vehiculosRoutes = require("./src/routes/vehiculosRoutes");
const placasRoutes = require("./src/routes/placasRoutes");
const licenciaRoutes = require("./src/routes/licenciaRoutes");
const extendidaRoutes = require("./src/routes/extendidaRoutes");
const infraccionRoutes = require("./src/routes/infraccionRoutes");
const articuloRoutes = require("./src/routes/articuloRoutes");
const firmaRoutes = require("./src/routes/firmaRoutes");
const estadoRoutes = require("./src/routes/estadoRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const boletaVehiculoRoutes = require("./src/routes/boletaVehiculoRoutes");
const multaRoutes = require("./src/routes/multaRoutes");
const multaDetalleRoutes = require("./src/routes/multaDetalleRoutes");
const boletasRoutes = require("./src/routes/boletas");
const boletasFinalRoutes = require("./src/routes/boletasFinal");
const multasRoutes = require('./src/routes/multasRoutes');
const buscarRoutes = require('./src/routes/buscarRoutes');
const trasladoRoutes = require("./src/routes/trasladoRoutes");
const conductorRoutes = require("./src/routes/conductorRoutes");
const eliminarRoutes = require("./src/routes/eliminarRoutes");
const noboletaRoutes = require("./src/routes/noboletaRoutes");




const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

 // Configurar la carpeta de archivos estáticos
 app.use(express.static(path.join(__dirname, "public")));
//  app.use("/api", authMiddleware);

 // Rutas específicas para las páginas HTML
 app.get("/index", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "index.html"));
 });

 app.get("/boleta", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "boleta.html"));
 });

 app.get("/registros", (req, res) => {
   res.sendFile(path.join(__dirname, "public", "registros.html"));
});

app.get("/solvencia", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "solvencia.html"));
});

app.get("/agente", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "agentes.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});




// Rutas
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/placas", placasRoutes);
app.use("/api/licencias", licenciaRoutes);
app.use("/api/extendidas", extendidaRoutes); 
app.use("/api/infracciones", infraccionRoutes);
app.use("/api/articulos", articuloRoutes);
app.use("/api/firmas", firmaRoutes);
app.use("/api/estados", estadoRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/boleta-vehiculo", boletaVehiculoRoutes);
app.use("/api/multa", multaRoutes);
app.use("/api/multa-detalle", multaDetalleRoutes);
app.use("/api/boletas", boletasRoutes);
app.use("/api/final", boletasFinalRoutes);
app.use("/api/detalles",multasRoutes);
app.use("/api/buscar", buscarRoutes);
app.use("/api/traslado", trasladoRoutes);
app.use("/api/conductor", conductorRoutes);
app.use("/api/eliminar", eliminarRoutes);
app.use("/api/noboleta", noboletaRoutes);


// Ruta principal (endpoint raíz "/")
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://127.0.0.1:${port}`);
});
