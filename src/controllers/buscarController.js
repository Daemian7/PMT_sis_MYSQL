const db = require("../db/db");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.buscarBoletas = async (req, res) => {
    try {
        const { tipoPlaca, placaCod } = req.body;
        const query = `
            SELECT BV.no_boleta, p.placa_inicial, BV.placa_cod, v.nombre AS tipo_vehiculo, BV.nit_prop,
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
            WHERE p.id_placa = ? AND BV.placa_cod = ? AND es.id_estado = 1
            GROUP BY BV.no_boleta, p.placa_inicial, BV.placa_cod, v.nombre, BV.nit_prop,
         BV.tarjeta_circ, BV.marca, BV.color, l.tipo_licen, BV.no_licencia,
         BV.dpi, e.ubicacion, BV.nombre, es.estado, ib.fecha;
        `;

        const [rows] = await db.query(query, [tipoPlaca, placaCod]);
        res.json(rows);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error al realizar la búsqueda" });
    }
};

exports.generarPDF = async (req, res) => {
    try {
        const { tipoPlaca, placaCod } = req.query;
        const query = `
            SELECT BV.no_boleta, p.placa_inicial, BV.placa_cod, v.nombre AS tipo_vehiculo, BV.nit_prop,
       BV.tarjeta_circ, BV.marca, BV.color, l.tipo_licen, BV.no_licencia,
       BV.dpi, e.ubicacion, BV.nombre, es.estado, a.precio, a.numero_artic, a.detalle, 
       DATE_FORMAT(ib.fecha, '%d/%m/%Y') AS fecha
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
            WHERE p.id_placa = ? AND BV.placa_cod = ? AND es.id_estado = 1;
        `;
        
        const [rows] = await db.query(query, [tipoPlaca, placaCod]);
        const placaNombre = rows.length > 0 ? rows[0].placa_inicial : (await db.query("SELECT placa_inicial FROM placa WHERE id_placa = ?", [tipoPlaca]))[0]?.[0]?.placa_inicial || tipoPlaca;
        
        generarPDFconDatos(res, rows, placaCod, placaNombre);
    } catch (error) {
        console.error("Error generando PDF:", error);
        res.status(500).json({ error: "Error generando el PDF" });
    }
};

function generarPDFconDatos(res, rows, placaCod, placaNombre) {
    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Disposition", 'attachment; filename="solvencia.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);
    
    const fechaActual = new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fechaActual.toLocaleDateString('es-ES', opciones);

const logoPath = path.join(__dirname, "../../public/img/logopmt.png");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, 50, 40, { width: 50 });
        }
    
    doc.fontSize(14).text("MUNICIPALIDAD DE SAN FELIPE", { align: "center", bold: true }).moveDown(0.5);
    doc.fontSize(14).text("JUZGADO DE ASUNTOS MUNICIPALES DE TRANSITO", { align: "center", bold: true }).moveDown(2);
    
    doc.fontSize(11).text(`El juzgado de Asuntos Municipales de Tránsito del Municipio de San Felipe Retalhuleu hace constar que, de acuerdo con los registros correspondientes, el vehículo identificado con el número de placas de circulación ${placaCod.toUpperCase()} TIPO ${placaNombre.toUpperCase()} al ${fechaFormateada}.`, { align: "justify" }).moveDown(2);
    
    if (rows.length === 0) {
        doc.fontSize(11).text("No tiene multas pendientes de pago en materia de tránsito, en base sobre la cual se le extiende la presente,", { align: "center" }).moveDown(2);
        doc.fontSize(12).text("SOLVENCIA DE TRÁNSITO", { align: "center" }).moveDown(0.2);
    } else {
        doc.fontSize(11).text("El vehículo tiene registradas las siguientes multas:", { align: "left" }).moveDown();
        rows.forEach((row, index) => {
            doc.fontSize(10).text(`Multa No.${index + 1}`, { bold: true }).moveDown();
            doc.text(`No. Boleta: ${row.no_boleta} | Placa Código: ${row.placa_cod} | Tipo Vehículo: ${row.tipo_vehiculo} | Artículo: ${row.numero_artic} | Detalle: ${row.detalle} | Estado: ${row.estado} | Precio: ${row.precio}`, { align: 'left' }).moveDown();
        });
    }
    
    doc.fontSize(11).text(`San Felipe, ${fechaFormateada}`, { align: "right" }).moveDown(1);
    doc.fontSize(11).text("Verificó: __________________", { align: "left" });
    if (rows.length === 0) doc.text("Valor Q. 25.00", { align: "right" });
    doc.moveDown(2);
    doc.text("Firma y Sello", { align: "right" });
    doc.end();
}
