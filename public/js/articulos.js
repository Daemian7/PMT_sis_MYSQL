document.addEventListener("DOMContentLoaded", () => {
    const selectArticulo = document.getElementById("articulo");
    const addArticuloBtn = document.getElementById("addarticulo");
    const articulosAddDiv = document.querySelector(".articulosadd");
    const totalInput = document.getElementById("total");

    let total = 0; // Variable para almacenar el total

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
                option.dataset.precio = item.precio; // Guardamos el precio en un atributo data
                selectArticulo.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar los artículos:", error);
        }
    };

    // Función para actualizar el total
    const actualizarTotal = () => {
        totalInput.value = total.toFixed(2); // Mostrar el total con dos decimales
    };

    addArticuloBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Evita el reinicio de la página

        const selectedOption = selectArticulo.options[selectArticulo.selectedIndex];

        if (selectedOption.value) {
            const articuloDiv = document.createElement("div");
            articuloDiv.classList.add("articulo-item");
            articuloDiv.dataset.id = selectedOption.value;

            const precio = parseFloat(selectedOption.dataset.precio); // Obtener el precio

            articuloDiv.innerHTML = `
                <span>${selectedOption.textContent} - Q${precio.toFixed(2)}</span>
                <button class="remove-btn">X</button>
            `;

            // Agregar funcionalidad para eliminar artículos
            articuloDiv.querySelector(".remove-btn").addEventListener("click", () => {
                total -= precio; // Restar el precio del artículo eliminado
                articuloDiv.remove();
                actualizarTotal(); // Actualizar el total después de eliminar
            });

            // Sumar el precio del artículo agregado al total
            total += precio;

            articulosAddDiv.appendChild(articuloDiv);

            // Actualizar el total
            actualizarTotal();
        }
    });

    cargarArticulos();
});
