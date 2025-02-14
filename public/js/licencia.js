// Asegúrate de que el DOM esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    const selectLicencia = document.getElementById("tipo-licencia");
  
    // Función para cargar los tipos de licencia desde la API
    const cargarLicencias = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/licencias");
  
        if (!response.ok) {
          throw new Error(`Error al obtener las licencias: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        // Itera sobre las licencias y las agrega al <select>
        data.forEach(licencia => {
          const option = document.createElement("option");
          option.value = licencia.id_licen || licencia.tipo_licen; // Usa un identificador único o tipo_licen si no hay id
          option.textContent = licencia.tipo_licen; // Muestra el campo tipo_licen
          selectLicencia.appendChild(option);
        });
      } catch (error) {
        console.error("Hubo un problema al cargar las licencias:", error);
      }
    };
  
    // Llama a la función para cargar las licencias
    cargarLicencias();
  });
  