document.addEventListener("DOMContentLoaded", () => {
    const btnBuscar = document.getElementById("btn_placa");
    const btnPDF = document.getElementById("btn_pdf");
    const resultBox = document.getElementById("result");
    const errorMsg = document.getElementById("error-msg");

    btnBuscar.addEventListener("click", async () => {
        const tipoPlaca = document.getElementById("placa").value;
        const placaCod = document.getElementById("txtplaca").value;

        if (!tipoPlaca || !placaCod) {
            errorMsg.textContent = "Debes ingresar todos los datos.";
            resultBox.innerHTML = "";
            btnPDF.disabled = false; // Siempre habilitado para generar PDF
            return;
        }

        errorMsg.textContent = ""; // Limpiar mensaje de error

        try {
            const response = await fetch("http://127.0.0.1:3000/api/buscar/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tipoPlaca, placaCod }),
            });

            const data = await response.json();

            if (data.length === 0) {
                resultBox.innerHTML = `<p class="error">No existen multas registradas.</p>`;
            } else {
                resultBox.innerHTML = generarTabla(data);
            }

            btnPDF.disabled = false; // Siempre permitir la generación del PDF
        } catch (error) {
            console.error("Error en la consulta:", error);
            errorMsg.textContent = "Hubo un problema en la búsqueda.";
        }
    });

    btnPDF.addEventListener("click", () => {
        const tipoPlaca = document.getElementById("placa").value;
        const placaCod = document.getElementById("txtplaca").value;
        window.open(`http://127.0.0.1:3000/api/buscar/generar-pdf?tipoPlaca=${tipoPlaca}&placaCod=${placaCod}`, "_blank");
    });

    function generarTabla(data) {
        let html = `<table>
            <thead>
                <tr>
                    <th>No. Boleta</th>
                    <th>Placa</th>
                    <th>Tipo Vehículo</th>
                    <th>Conductor</th>
                    <th>DPI</th>
                    <th>Total</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>`;

        data.forEach(boleta => {
            html += `
                <tr>
                    <td>${boleta.no_boleta}</td>
                    <td>${boleta.placa_cod}</td>
                    <td>${boleta.tipo_vehiculo}</td>
                    <td>${boleta.nombre}</td>
                    <td>${boleta.dpi}</td>
                    <td>${boleta.total_precio}</td>
                    <td>${boleta.estado}</td>
                </tr>`;
        });

        html += `</tbody></table>`;
        return html;
    }
});
