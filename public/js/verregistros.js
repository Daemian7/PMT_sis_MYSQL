document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector("#registros tbody");
    const btnActivas = document.getElementById("activo");
    const btnInactivas = document.getElementById("inactivo");
    const btnTodas = document.getElementById("todas");

    let boletas = []; // Almacena los datos originales
    let filtroActual = null; // Guarda el filtro actual para conservarlo tras actualización

    // 🔹 Función para renderizar la tabla con filtro opcional
    function renderizarTabla(filtroEstado = null) {
        tbody.innerHTML = ""; // Limpiar la tabla antes de agregar filas

        boletas
            .filter(boleta => filtroEstado === null || boleta.estado === filtroEstado)
            .forEach(boleta => {
                const row = document.createElement("tr");

                // Convertir estado a número
                const estadoNumerico = boleta.estado === "Activo" ? 1 : 2;

                // Aplicar color según estado
                row.style.backgroundColor = estadoNumerico === 1 ? "#91ff8c" : "#ff8181";

                row.innerHTML = `
                    <td>${boleta.no_boleta}</td>
                    <td>${boleta.placa_inicial}</td>
                    <td>${boleta.placa_cod.toUpperCase()}</td>
                    <td>${boleta.tipo_vehiculo}</td>
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
                    <td>${boleta.total_precio}</td>
                    <td class="estado">${boleta.estado}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-btn"  id="btn_delete"
                            data-id="${boleta.id_boleta}" 
                            data-estado="${estadoNumerico}">
                            <i class="bi bi-x-square-fill"></i>
                        </button>
                    </td>
                `;

                tbody.appendChild(row);
            });
    }

    // 🔹 Obtener datos y guardar en `boletas`
    fetch("http://127.0.0.1:3000/api/final")
        .then(response => response.json())
        .then(data => {
            boletas = data;
            renderizarTabla(); // Renderizar todas al inicio
        })
        .catch(error => console.error("Error al obtener boletas:", error));

    // 🔹 EVENT DELEGATION: Escuchar clics en los botones de editar
    tbody.addEventListener("click", function (event) {
        if (event.target.closest(".editar-btn")) {
            const button = event.target.closest(".editar-btn");
            const idBoleta = button.getAttribute("data-id");

            // Buscar la boleta seleccionada
            const boleta = boletas.find(b => b.id_boleta == idBoleta);

            if (boleta) {
                // Llenar los campos del modal con los datos de la boleta
                document.getElementById("editNoBoleta").value = boleta.no_boleta;
                document.getElementById("editEstado").value = boleta.estado === "Activo" ? 1 : 2;

                // Mostrar el modal
                new bootstrap.Modal(document.getElementById('editModal')).show();

                // Manejar la acción de guardar cambios
                document.getElementById("editBoletaForm").onsubmit = function (event) {
                    event.preventDefault(); // Prevenir el envío del formulario

                    const nuevoEstado = parseInt(document.getElementById("editEstado").value);

                    // Enviar actualización a la API
                    fetch(`http://127.0.0.1:3000/api/final/${idBoleta}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ estado: nuevoEstado })
                    })
                    .then(response => response.json())
                    .then(() => {
                        console.log("Estado actualizado con éxito");

                        // 🆕 Actualizar el estado en el array de boletas
                        boleta.estado = nuevoEstado === 1 ? "Activo" : "Inactivo";

                        // Cerrar el modal
                        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
                        modal.hide();

                        // 🔄 Volver a renderizar la tabla
                        renderizarTabla(filtroActual);
                    })
                    .catch(error => console.error("Error al actualizar estado:", error));
                };
            }
        }
    });

    // 🔹 Filtrar por multas activas
    btnActivas.addEventListener("click", () => {
        filtroActual = "Activo";
        renderizarTabla(filtroActual);
    });

    // 🔹 Filtrar por multas inactivas
    btnInactivas.addEventListener("click", () => {
        filtroActual = "Inactivo";
        renderizarTabla(filtroActual);
    });

    // 🔹 Mostrar todas las multas
    btnTodas.addEventListener("click", () => {
        filtroActual = null;
        renderizarTabla();
    });
});
