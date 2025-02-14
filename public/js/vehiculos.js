// Asegúrate de que el DOM esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    const selectVehiculo = document.getElementById("tipo-vehiculo");
  
    // Función para cargar los vehículos desde la API
    const cargarVehiculos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/vehiculos");
  
        if (!response.ok) {
          throw new Error(`Error al obtener los vehículos: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        // Itera sobre los vehículos y los agrega al <select>
        data.forEach(vehiculo => {
          const option = document.createElement("option");
          option.value = vehiculo.id_vehiculo; // Si existe un identificador único
          option.textContent = vehiculo.nombre; // Muestra el campo 'nombre' del vehículo
          selectVehiculo.appendChild(option);
        });
      } catch (error) {
        console.error("Hubo un problema al cargar los vehículos:", error);
      }
    };
  
    // Llama a la función para cargar los vehículos
    cargarVehiculos();
  });
  