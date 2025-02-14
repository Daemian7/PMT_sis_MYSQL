document.addEventListener("DOMContentLoaded", () => {
    const selectLugarExt = document.getElementById("lugar_ext");
  
    const cargarLugares = async () => {
      try {
        // Realizar una solicitud GET a la API
        const response = await fetch("http://127.0.0.1:3000/api/extendidas");
  
        // Verificar si la respuesta es válida
        if (!response.ok) {
          throw new Error(`Error al obtener los lugares: ${response.statusText}`);
        }
  
        // Convertir la respuesta en JSON
        const data = await response.json();
  
        // Iterar sobre los datos y agregar opciones al select
        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id_exten || item.ubicacion; // Usa un identificador único o el campo ubicación
          option.textContent = item.ubicacion; // Texto que se muestra en el select
          selectLugarExt.appendChild(option);
        });
      } catch (error) {
        console.error("Error al cargar los lugares:", error);
      }
    };
  
    cargarLugares();
  });
  