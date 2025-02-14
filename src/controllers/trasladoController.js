const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.generarPDF = (req, res) => {
    const fechaActual = new Date().toLocaleDateString();
    const horaActual = new Date().toLocaleTimeString();

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Disposition", 'attachment; filename="traslado.pdf"');
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Logo
    const logoPath = path.join(__dirname, "../../public/img/logopmt.png");
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 30, 40, { width: 60 });
    }

    // Encabezado
    doc
        .fontSize(16)
        .text("SOLICITUD DE TRASLADO A PREDIO MUNICIPAL", { align: "center", underline: true })
        .moveDown();

    // Fecha y Hora
    doc
        .fontSize(12)
        .text(`Fecha de impresión: ${fechaActual}`, { align: "right" })
        .text(`Hora de impresión: ${horaActual}`, { align: "right" })
        .moveDown();

    // Línea divisoria
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();

    // Información del Vehículo
    doc
        .fontSize(12)
        .text("Información del Vehículo", { align: "left", bold: true })
        .moveDown(2);

    const yPos = doc.y; // Guardamos la posición actual en Y

    doc
        .fontSize(11)
        .text("Placa", 50, yPos, { width: 100 })
        .text("Tipo de Vehículo", 150, yPos, { width: 150 })
        .text("Marca", 300, yPos, { width: 100 })
        .text("Color", 400, yPos, { width: 100 });

    // Dibujar la línea en la misma posición Y
    doc.moveDown(4); // Hace 4 saltos de línea antes de dibujar la línea
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();        

    // Información de Multas
    const text = "Infracciones de Tránsito Pendientes";
    const pageWidth = doc.page.width;
    const textWidth = doc.widthOfString(text);
    const centerX = (pageWidth - textWidth) / 2; // Calcula la posición X centrada
    //         
    
    doc
        .fontSize(14)
        .text(text, centerX, doc.y) // Usa la posición X calculada
        .moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();
    doc
        
        .fontSize(11)
        .text("En base a lo decretado en el Artículo 190 de la ley de Tránsito.", 50, doc.y)
        .moveDown();
    
    doc
        .fontSize(11)
        .text("Traslado de vehículos Infractores al Depósito:", 50, doc.y, { underline: true }) // Solo este texto subrayado
        .text(
            "Treinta días después de impuesta la multa sin que la misma se haya cancelado, la autoridad de tránsito solicitará el traslado del vehículo infractor al depósito correspondiente.",
            50, doc.y, { align: "left", width: 500 } // Texto normal sin subrayado
        )
        .text(
            "Multas Pendientes",
            50, doc.y, { align: "left", width: 500 } // Texto normal sin subrayado
        )
        .moveDown(2);

    // Tabla de multas    
   // Tabla de multas en una sola línea
   const yPosTabla = doc.y; // Guarda la posición actual en Y antes de escribir

// Escribir toda la fila manualmente en la misma línea
doc
    .fontSize(11)
    .text("Boleta Fecha", 50, yPosTabla)
    .text("Lugar", 150, yPosTabla)
    .text("Conductor/Licencia", 220, yPosTabla)
    .text("Infracción de Tránsito", 360, yPosTabla)
    .text("Valor", 500, yPosTabla)
    .moveDown(4);

    // Dibujamos la línea justo debajo del texto
    doc.moveTo(50, doc.y + 15).lineTo(550, doc.y + 15).stroke().moveDown(2);

    const yPosResumen = doc.y; // Guarda la posición actual en Y antes de escribir

    doc
        .fontSize(11)
        .text("Número de Infracciones:", 50, yPosResumen, { width: 200 })
        .text("Total General:", 300, yPosResumen, { width: 150 })
        .moveDown();

    doc.end();
};