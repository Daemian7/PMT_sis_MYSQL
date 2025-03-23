document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.querySelector("#registros tbody");
    const btnActivas = document.getElementById("activo");
    const btnInactivas = document.getElementById("inactivo");
    const btnTodas = document.getElementById("todas");
    let boletas = []; 
    let filtroActual = null; 
    let boletaIdAEliminar = null;

    // 🔹 Función para crear y agregar el modal de eliminación dinámicamente
    function crearModalEliminacion() {
        const modalContainer = document.createElement('div');
        modalContainer.classList.add('modal', 'fade');
        modalContainer.id = 'deleteModal';
        modalContainer.setAttribute('tabindex', '-1');
        modalContainer.setAttribute('aria-labelledby', 'deleteModalLabel');
        modalContainer.setAttribute('aria-hidden', 'true');

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
      
      <!-- Nuevo input de fecha -->
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

    // 🔹 Crear el modal de eliminación al inicio
    crearModalEliminacion();

    // Seleccionar los elementos del modal después de crearlo
    const confirmDeleteBtn = document.getElementById("confirmDelete");
    const reciboInput = document.getElementById("reciboInput");
    const deleteModalEl = document.getElementById("deleteModal");
    const deleteModal = new bootstrap.Modal(deleteModalEl);

    function renderizarTabla(filtroEstado = null) {
        tbody.innerHTML = ""; 
        boletas
            .filter(boleta => filtroEstado === null || boleta.estado === filtroEstado)
            .forEach(boleta => {
                const row = document.createElement("tr");

                row.style.backgroundColor = boleta.estado === "Activo" ? "#91ff8c" : "#ff8181";

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
                    <td>${boleta.dpi}</td>
                    <td>${boleta.nombre}</td>
                    <td>${boleta.fecha}</td>
                    <td>${boleta.total_precio}</td>
                    <td class="estado">${boleta.estado}</td>
                    <td>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${boleta.id_boleta}">
                            <i class="bi bi-x-square-fill"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
    }

    fetch("http://127.0.0.1:3000/api/final")
        .then(response => response.json())
        .then(data => {
            boletas = data;
            renderizarTabla();
        })
        .catch(error => console.error("Error al obtener boletas:", error));

    tbody.addEventListener("click", function (event) {
        if (event.target.closest(".delete-btn")) {
            const button = event.target.closest(".delete-btn");
            boletaIdAEliminar = button.getAttribute("data-id");

            reciboInput.value = ""; 
            deleteModal.show();
        }
    });

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
                boletas = boletas.filter(b => b.id_boleta != boletaIdAEliminar);
                renderizarTabla(filtroActual);
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
    
    

    btnActivas.addEventListener("click", () => {
        filtroActual = "Activo";
        renderizarTabla(filtroActual);
    });

    btnInactivas.addEventListener("click", () => {
        filtroActual = "Inactivo";
        renderizarTabla(filtroActual);
    });

    btnTodas.addEventListener("click", () => {
        filtroActual = null;
        renderizarTabla();
    });
});
