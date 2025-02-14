document.getElementById("clean").addEventListener("click", function(event) {
    event.preventDefault(); // Evita la recarga de la página si está dentro de un formulario

    // Seleccionar todos los inputs y selects dentro del formulario
    const inputs = document.querySelectorAll("input");
    const selects = document.querySelectorAll("select");

    // Limpiar todos los inputs (excepto los deshabilitados como el de imagen)
    inputs.forEach(input => {
        if (input.type === "text" || input.type === "date" || input.type === "time") {
            input.value = "";
        } else if (input.type === "number") {
            input.value = 0;
        }
    });

    // Restablecer todos los selects a la primera opción
    selects.forEach(select => {
        select.selectedIndex = 0;
    });

    // Limpiar los artículos agregados en la sección de multas
    const articulosAddDiv = document.querySelector(".articulosadd");
    articulosAddDiv.innerHTML = "";

    // Resetear el total a 0
    document.getElementById("total").value = "0.00";
});
