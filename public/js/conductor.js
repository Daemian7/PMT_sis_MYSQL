document.getElementById("btn_conductor").addEventListener("click", async () => {
    const searchType = document.getElementById("searchType").value;
    const searchInput = document.getElementById("searchInput");
    const searchValue = searchInput.value.trim();
    const resultDiv = document.getElementById("result");
    const btnPdf = document.getElementById("btn_pdf_con");

    // Manejo de mensaje de error
    let errorMsg = document.getElementById("error-msg") || document.createElement("p");
    errorMsg.id = "error-msg";
    errorMsg.style.color = "red";
    resultDiv.innerHTML = ""; // Limpiar resultados previos
    resultDiv.appendChild(errorMsg); // Asegurar que el mensaje de error esté presente
    errorMsg.textContent = ""; // Limpiar el mensaje

    if (!searchValue) {
        errorMsg.textContent = "Por favor, ingrese un valor de búsqueda.";
        return;
    }

    try {
        const url = `http://127.0.0.1:3000/api/conductor/buscar-boletas?tipo=${searchType}&valor=${encodeURIComponent(searchValue)}`;
        const response = await fetch(url);

        if (!response.ok) {  
            let errorMessage = "Error en la consulta a la API.";
            if (response.status === 404) {
                errorMessage = "No se encuentran multas registradas.";
            } else if (response.status === 500) {
                errorMessage = "Error interno del servidor. Intente más tarde.";
                console.error("Error 500:", await response.text());
            } else {
                try { 
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) { /* Ignorar si no hay JSON en la respuesta de error */ }
            }
            errorMsg.textContent = errorMessage;

            // 🔹 Permitir generar PDF incluso si no hay multas
            btnPdf.disabled = false;
            return;
        }

        const data = await response.json();

        if (!data || data.length === 0) { 
            errorMsg.textContent = "No se encuentran multas registradas.";
            btnPdf.disabled = false; // 🔹 Habilitar PDF aunque no haya multas
            return;
        }

        // Crear tabla de resultados
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.style.textAlign = "left";
        table.border = "1";

        const headerRow = table.insertRow();
["No. Boleta", "Placa", "Tipo Vehículo", "Nombre", "Estado", "DPI", "Total Q"].forEach(headerText => {
    const headerCell = headerRow.insertCell();
    headerCell.textContent = headerText;
    headerCell.style.fontWeight = "bold";
});

data.forEach(boleta => {
    const row = table.insertRow();
    ["no_boleta", "placa_cod", "tipo_vehiculo", "nombre", "estado", "dpi", "total_precio"].forEach(key => {
        const cell = row.insertCell();
        cell.textContent = key === "total_precio" ? `Q${boleta[key].toFixed(2)}` : boleta[key]; // Formatear el total con "Q" y dos decimales
    });
});

        resultDiv.appendChild(table);
        btnPdf.disabled = false; // 🔹 Siempre permitir la generación del PDF

    } catch (error) {
        console.error("Error general en la búsqueda:", error);
        errorMsg.textContent = "Error al realizar la búsqueda.";
        btnPdf.disabled = false; // 🔹 Asegurar que el botón de PDF siga activo
    }
});

// Evento para generar el PDF
document.getElementById("btn_pdf_con").addEventListener("click", () => {
    const searchType = document.getElementById("searchType").value;
    const searchValue = document.getElementById("searchInput").value.trim();

    if (!searchValue) {
        alert("Por favor, ingrese un valor antes de generar el PDF.");
        return;
    }

    const url = `http://127.0.0.1:3000/api/conductor/generar-pdf?tipo=${encodeURIComponent(searchType)}&valor=${encodeURIComponent(searchValue)}`;
    window.open(url, "_blank"); // Abre una nueva pestaña con el PDF
});

// Cambiar el placeholder dinámicamente según la selección
document.getElementById("searchType").addEventListener("change", function () {
    document.getElementById("searchInput").placeholder = `Ingrese ${this.value}`;
});
