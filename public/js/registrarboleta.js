document.getElementById("submitButton").addEventListener("click", async function () {
    // Capturar valores del formulario
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

    // Crear el objeto con los datos
    const formData = {
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
        const response = await fetch("http://127.0.0.1:3000/api/boleta-vehiculo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Boleta insertada correctamente");
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error al enviar la boleta:", error);
        alert("Error al enviar la boleta. Revisa la consola para más detalles.");
    }
});
