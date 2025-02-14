document.addEventListener("DOMContentLoaded", () => {
    const selectFirma = document.getElementById("firma");
  
    const cargarFirmas = async () => {
      try {
        // Realizar una solicitud GET a la API
        const response = await fetch("http://127.0.0.1:3000/api/firmas");
  
        // Verificar si la respuesta es válida
        if (!response.ok) {
          throw new Error(`Error al obtener las firmas: ${response.statusText}`);
        }
  
        // Convertir la respuesta en JSON
        const data = await response.json();
  
        // Iterar sobre los datos y agregar opciones al select
        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.id_firma; // Asignar tipo_firma como valor
          option.textContent = item.tipo_firma; // Mostrar tipo_firma como texto
          selectFirma.appendChild(option);
        });
      } catch (error) {
        console.error("Error al cargar las firmas:", error);
      }
    };
  
    cargarFirmas();
  });
  