document.addEventListener("DOMContentLoaded", () => {
    const btnBuscar = document.getElementById("btn_boleta");
    const resultBox = document.getElementById("result");
    const errorMsg = document.getElementById("error-msg");
    let lastSearchId = 0;
    let boletaIdAEliminar = null;
    let boletas = [];  // Definir boletas aquí

    // 🔹 Crear modal de eliminación dinámicamente
    function crearModalEliminacion() {
        const modalContainer = document.createElement("div");
        modalContainer.classList.add("modal", "fade");
        modalContainer.id = "deleteModal";
        modalContainer.setAttribute("tabindex", "-1");
        modalContainer.setAttribute("aria-labelledby", "deleteModalLabel");
        modalContainer.setAttribute("aria-hidden", "true");

        modalContainer.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Confirmar Eliminación</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <label for="reciboInput" class="form-label">Ingrese el número de recibo:</label>
                        <input type="text" class="form-control" id="reciboInput" placeholder="Número de recibo">
                        <label for="fechaInput" class="form-label mt-3">Seleccione una fecha:</label>
                        <input type="date" class="form-control" id="fechaInput">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-danger" id="confirmDelete">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);
    }

    crearModalEliminacion();

    // ✅ Esperar a que Bootstrap se cargue correctamente
    let deleteModalEl = document.getElementById("deleteModal");
    let deleteModal;
    if (typeof bootstrap !== "undefined") {
        deleteModal = new bootstrap.Modal(deleteModalEl);
    } else {
        console.error("Bootstrap no está definido. Asegúrate de incluir bootstrap.bundle.min.js en tu HTML.");
        return;
    }

    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const reciboInput = document.getElementById("reciboInput");

    // 🔍 Buscar boleta
    btnBuscar.addEventListener("click", async () => {
        const noBoleta = document.getElementById("searchBoleta").value.trim();

        if (!noBoleta) {
            errorMsg.textContent = "Debes ingresar el número de boleta.";
            resultBox.innerHTML = "";
            return;
        }

        errorMsg.textContent = "";
        resultBox.innerHTML = "<p>Cargando...</p>";
        const searchId = ++lastSearchId;

        try {
            const response = await fetch("http://127.0.0.1:3000/api/noboleta", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ no_boleta: noBoleta }),
            });

            if (searchId !== lastSearchId) return;

            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status}`);
            }

            const data = await response.json();

            if (data.length === 0) {
                resultBox.innerHTML = `<p class="error">No existen boletas registradas.</p>`;
            } else {
                boletas = data;  // Actualiza la lista de boletas con la respuesta
                resultBox.innerHTML = generarTabla(data);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            errorMsg.textContent = "Hubo un problema al consultar la boleta.";
            resultBox.innerHTML = "";
        }
    });

    function generarTabla(data) {
        let html = `<table class="table table-bordered" style="background-color: white; width: 100%; border: 1px solid #ddd;">
            <thead>
                <tr style="background-color: #007bff; color: white;">
                    <th>No. Boleta</th>
                    <th>Tipo de Placa</th>
                    <th>Placa</th>
                    <th>Tipo Vehículo</th>
                    <th>Conductor</th>
                    <th>DPI</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>`;

        data.forEach((boleta) => {
            html += `
                <tr>
                    <td>${boleta.no_boleta}</td>
                    <td>${boleta.placa_inicial}</td>
                    <td>${boleta.placa_cod}</td>
                    <td>${boleta.tipo_vehiculo}</td>
                    <td>${boleta.nombre}</td>
                    <td>${boleta.dpi}</td>
                    <td>${boleta.fecha}</td>
                    <td>${boleta.total_precio}</td>
                    <td>${boleta.estado}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${boleta.id_boleta}" style="background-color: #dc3545; border-color: #dc3545;">
                            X
                        </button>
                    </td>
                </tr>`;
        });

        html += `</tbody></table>`;
        return html;
    }

    // 🗑️ Evento para mostrar el modal de eliminación
    resultBox.addEventListener("click", function (event) {
        if (event.target.closest(".delete-btn")) {
            const button = event.target.closest(".delete-btn");
            boletaIdAEliminar = button.getAttribute("data-id");
            reciboInput.value = "";
            deleteModal.show();
        }
    });

    // 🚨 Confirmar eliminación
    confirmDeleteBtn.addEventListener("click", function () {
        const numeroRecibo = reciboInput.value.trim();
        
        // 📌 Mostrar en consola el número de recibo ingresado
        console.log("Número de recibo ingresado:", numeroRecibo);
        
        if (numeroRecibo === "") {
            alert("Por favor, ingrese un número de recibo.");
            return;
        }
    
        // 📌 Mostrar en consola el ID de la boleta a eliminar
        console.log("ID de boleta a eliminar:", boletaIdAEliminar);
    
        fetch("http://127.0.0.1:3000/api/eliminar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_boleta: boletaIdAEliminar,
                no_recibo: numeroRecibo
            })
        })
        .then(response => response.json())
        .then(data => {
            // 📌 Mostrar la respuesta del servidor en la consola
            console.log("Respuesta del servidor:", data);
    
            // Verifica el mensaje de éxito devuelto por el servidor
            if (data.message === "Boleta eliminada y transferida exitosamente.") {
                boletas = boletas.filter(b => b.id_boleta != boletaIdAEliminar);  // Actualiza boletas aquí
                resultBox.innerHTML = generarTabla(boletas);  // Re-renderiza la tabla con los datos actualizados
                deleteModal.hide();
            } else {
                alert("No se pudo eliminar la boleta.");
            }
        })
        .catch(error => {
            console.error("Error al eliminar la boleta:", error);
            alert("Ocurrió un error al eliminar la boleta.");
        });
    });
});
