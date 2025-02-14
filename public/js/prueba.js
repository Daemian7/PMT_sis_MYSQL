document.addEventListener("DOMContentLoaded", () => {
    const selectArticulo = document.getElementById("articulo");
    const addArticuloBtn = document.getElementById("addarticulo");
    const articulosAddDiv = document.querySelector(".articulosadd");
    const totalInput = document.getElementById("total");
    const boletaForm = document.getElementById("boletaForm");

    let total = 0;
    let articulosSeleccionados = [];

    const cargarArticulos = async () => {
        try {
            const response = await fetch("http://127.0.0.1:3000/api/articulos");

            if (!response.ok) {
                throw new Error(`Error al obtener los artículos: ${response.statusText}`);
            }

            const data = await response.json();

            data.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id_artic;
                option.textContent = `${item.numero_artic} - ${item.detalle}`;
                option.dataset.precio = item.precio;
                selectArticulo.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar los artículos:", error);
        }
    };

    const actualizarTotal = () => {
        totalInput.value = total.toFixed(2);
    };

    addArticuloBtn.addEventListener("click", (event) => {
        event.preventDefault();

        const selectedOption = selectArticulo.options[selectArticulo.selectedIndex];

        if (selectedOption.value) {
            const articuloDiv = document.createElement("div");
            articuloDiv.classList.add("articulo-item");
            articuloDiv.dataset.id = selectedOption.value;

            const precio = parseFloat(selectedOption.dataset.precio);

            articuloDiv.innerHTML = `
                <span>${selectedOption.textContent} - Q${precio.toFixed(2)}</span>
                <button class="remove-btn">X</button>
            `;

            articuloDiv.querySelector(".remove-btn").addEventListener("click", () => {
                total -= precio;
                articulosSeleccionados = articulosSeleccionados.filter(id => id !== selectedOption.value);
                articuloDiv.remove();
                actualizarTotal();
            });

            total += precio;

            articulosAddDiv.appendChild(articuloDiv);
            articulosSeleccionados.push(selectedOption.value);
            actualizarTotal();
        }
    });

    cargarArticulos();

    // **Modificar el código de envío para incluir todos los pasos previos**
    document.getElementById("submit-button").addEventListener("click", async function (event) {
        event.preventDefault();

        try {
            // **(1) Enviar Boleta Vehículo**
            const response1 = await fetch("http://127.0.0.1:3000/api/boleta-vehiculo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tipo_placa: document.getElementById("tipo-placa").value,
                    placa_cod: document.getElementById("placa").value,
                    id_vehiculo: document.getElementById("tipo-vehiculo").value,
                    nit_prop: document.getElementById("propietario").value,
                    tarjeta_circ: document.getElementById("tarjeta").value,
                    marca: document.getElementById("marca").value,
                    color: document.getElementById("color").value,
                    tipo_licencia: document.getElementById("tipo-licencia").value,
                    no_licencia: document.getElementById("licencia").value,
                    no_doc_licencia: document.getElementById("doclicencia").value,
                    dpi: document.getElementById("dpi").value,
                    extendida: document.getElementById("lugar_ext").value,
                    nombre: `${document.getElementById("primer-nombre").value} ${document.getElementById("segundo-nombre").value} ${document.getElementById("primer-apellido").value} ${document.getElementById("segundo-apellido").value}`.trim(),
                    no_boleta: document.getElementById("no_boleta").value
                })
            });

            if (!response1.ok) throw new Error("Error al registrar boleta de vehículo.");

            // **(2) Enviar Boleta**
            const response2 = await fetch("http://127.0.0.1:3000/api/boletas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ubicacion: document.getElementById("lugar_infrac").value,
                    fecha: document.getElementById("fecha").value,
                    hora: document.getElementById("hora").value,
                    id_usuario: document.getElementById("agente").value,
                    observaciones: document.getElementById("observaciones").value,
                    id_firma: document.getElementById("firma").value,
                    id_infrac: document.getElementById("infraccion").value
                })
            });

            if (!response2.ok) throw new Error("Error al registrar la boleta.");

            // **(3) Enviar Multa**
            const total = parseFloat(totalInput.value);
            if (!total || isNaN(total) || total <= 0) throw new Error("Total inválido.");

            const response3 = await fetch("http://127.0.0.1:3000/api/multa/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total })
            });

            if (!response3.ok) throw new Error("Error al insertar la multa.");

            // **(4) Enviar detalles de multa**
            for (const id_articulo of articulosSeleccionados) {
                const responseDetalle = await fetch("http://127.0.0.1:3000/api/detalles/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id_articulo })
                });

                if (!responseDetalle.ok) throw new Error(`Error al insertar detalle para artículo ${id_articulo}.`);
            }

            alert("Multa y detalles insertados correctamente.");

            // **(5) Después de todo el proceso, ejecutar sp_InsertBoletaFinal**
            const fechaVencimiento = document.getElementById("fechainfo").value;

            if (!fechaVencimiento) {
                alert("Por favor, selecciona una fecha de vencimiento.");
                return;
            }

            const responseFinal = await fetch("http://127.0.0.1:3000/api/final", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vencimiento: fechaVencimiento })
            });

            if (!responseFinal.ok) throw new Error("Error al insertar la boleta final.");

            const dataFinal = await responseFinal.json();
            alert(dataFinal.message);

        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert(`Hubo un problema: ${error.message}`);
        }
    });
});
