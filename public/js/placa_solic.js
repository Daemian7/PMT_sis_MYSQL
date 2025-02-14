// Asegúrate de que el DOM esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    const selectPlaca = document.getElementById("placa");
  
    // Función para cargar las placas desde la API
    const cargarPlacas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/placas");
  
        if (!response.ok) {
          throw new Error(`Error al obtener las placas: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        // Itera sobre las placas y las agrega al <select>
        data.forEach(placa => {
          const option = document.createElement("option");
          option.value = placa.id_placa; // Usa el campo correspondiente al identificador único
          option.textContent = placa.placa_inicial; // Muestra el valor deseado de la placa
          selectPlaca.appendChild(option);
        });
      } catch (error) {
        console.error("Hubo un problema al cargar las placas:", error);
      }
    };
  
    // Llama a la función para cargar las placas
    cargarPlacas();
  });
  