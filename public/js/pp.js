document.getElementById("submit-button").addEventListener("click", async function (event) {
    event.preventDefault(); // Evita el comportamiento por defecto del botón

    // Capturar datos del primer formulario (boleta-vehiculo)
    const no_boleta = document.getElementById("no_boleta").value;
    const tipo_placa = document.getElementById("tipo-placa").value;
    const placa_cod = document.getElementById("placa").value;
    const id_vehiculo = document.getElementById("tipo-vehiculo").value;
    const nit_prop = document.getElementById("propietario").value;
    const tarjeta_circ = document.getElementById("tarjeta").value;
    const marca = document.getElementById("marca").value;
    const color = document.getElementById("color").value;
    const tipo_licencia = document.getElementById("tipo-licencia").value;
    const no_licencia = document.getElementById("licencia").value;
    const no_doc_licencia = document.getElementById("doclicencia").value;
    const dpi = document.getElementById("dpi").value;
    const extendida = document.getElementById("lugar_ext").value;

    // Unir nombres y apellidos en un solo campo
    const primer_nombre = document.getElementById("primer-nombre").value;
    const segundo_nombre = document.getElementById("segundo-nombre").value;
    const primer_apellido = document.getElementById("primer-apellido").value;
    const segundo_apellido = document.getElementById("segundo-apellido").value;
    const nombre = `${primer_nombre} ${segundo_nombre} ${primer_apellido} ${segundo_apellido}`.trim();

    // Crear objeto con los datos de la primera API
    const formData1 = {
        tipo_placa,
        placa_cod,
        id_vehiculo,
        nit_prop,
        tarjeta_circ,
        marca,
        color,
        tipo_licencia,
        no_licencia,
        no_doc_licencia,
        dpi,
        extendida,
        nombre,
        no_boleta
    };

    try {
        // Enviar primera API
        const response1 = await fetch("http://127.0.0.1:3000/api/boleta-vehiculo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData1)
        });

        const result1 = await response1.json();

        if (!response1.ok) {
            throw new Error(result1.message || "Error al registrar boleta de vehículo.");
        }

        alert("Boleta de vehículo insertada correctamente.");

        // **Si la primera API fue exitosa, proceder con la segunda API**
        const ubicacion = document.getElementById("lugar_infrac").value;
        const fecha = document.getElementById("fecha").value;
        const hora = document.getElementById("hora").value;
        const id_usuario = document.getElementById("agente").value;
        const observaciones = document.getElementById("observaciones").value;
        const id_firma = document.getElementById("firma").value;
        const id_infrac = document.getElementById("infraccion").value;

        // Validar que no haya campos vacíos antes de enviar la segunda API
        if (!ubicacion || !fecha || !hora || !id_usuario || !id_firma || !id_infrac) {
            alert("Por favor, complete todos los campos de la segunda parte.");
            return;
        }

        // Crear objeto con los datos de la segunda API
        const formData2 = {
            ubicacion,
            fecha,
            hora,
            id_usuario,
            observaciones,
            id_firma,
            id_infrac
        };

        // Enviar segunda API
        const response2 = await fetch("http://127.0.0.1:3000/api/boletas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData2)
        });

        const result2 = await response2.json();

        if (!response2.ok) {
            throw new Error(result2.error || "Error al registrar la boleta.");
        }

        alert("Boleta registrada correctamente.");
        console.log("Registro exitoso:", result2);

        // **Tercera API: Insertar el total**
        const total = document.getElementById("total").value;

        // Validar que el total no esté vacío
        if (!total || isNaN(total) || Number(total) <= 0) {
            alert("Por favor, ingrese un valor válido para el total.");
            return;
        }

        // Crear objeto con los datos de la tercera API
        const formData3 = { total };

        // Enviar tercera API
        const response3 = await fetch("http://127.0.0.1:3000/api/multa/insert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData3)
        });

        const result3 = await response3.json();

        if (!response3.ok) {
            throw new Error(result3.error || "Error al insertar la multa.");
        }

        alert("Multa insertada correctamente.");
        console.log("Multa insertada:", result3);

    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema al registrar la multa.");
    }
});
