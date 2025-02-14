document.addEventListener("DOMContentLoaded", () => {
    const selectInfraccion = document.getElementById("infraccion");
  
    const cargarInfracciones = async () => {
      try {
        // Realizar una solicitud GET a la API
        const response = await fetch("http://127.0.0.1:3000/api/infracciones");
  
        // Verificar si la respuesta es válida
        if (!response.ok) {
          throw new Error(`Error al obtener las infracciones: ${response.statusText}`);
        }
  
        // Convertir la respuesta en JSON
        const data = await response.json();
  
        // Iterar sobre los datos y agregar opciones al select
        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id_ifrac; // Asignar tipo_infrac como valor
          option.textContent = item.tipo_infrac; // Mostrar tipo_infrac como texto
          selectInfraccion.appendChild(option);
        });
      } catch (error) {
        console.error("Error al cargar las infracciones:", error);
      }
    };
  
    cargarInfracciones();
  });
  