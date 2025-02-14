document.addEventListener("DOMContentLoaded", function () {
    fetch("http://127.0.0.1:3000/api/final")
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#registros tbody");
            tbody.innerHTML = ""; // Limpiar contenido previo

            data.forEach(boleta => {
                const row = document.createElement("tr");

                // Definir color de fila según estado
                if (boleta.estado === "Activo") {
                    row.style.backgroundColor = "#91ff8c";
                } else if (boleta.estado === "Inactivo") {
                    row.style.backgroundColor = "#ff8181";
                }

                row.innerHTML = `
                    <td>${boleta.no_boleta}</td>
                    <td>${boleta.placa_inicial}</td>
                    <td>${boleta.placa_cod}</td>
                    <td>${boleta.nombre}</td>
                    <td>${boleta.nit_prop}</td>
                    <td>${boleta.tarjeta_circ}</td>
                    <td>${boleta.marca}</td>
                    <td>${boleta.color}</td>
                    <td>${boleta.tipo_licen}</td>
                    <td>${boleta.no_licencia}</td>
                    <td>${boleta.no_doc_licencia}</td>
                    <td>${boleta.dpi}</td>
                    <td>${boleta.ubicacion}</td>
                    <td>${boleta.nombre}</td>
                    <td>${boleta.estado}</td>
                    <td>
                        <button class="btn btn-primary btn-sm">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                `;

                tbody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al obtener boletas:", error));
});
