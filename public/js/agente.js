document.addEventListener("DOMContentLoaded", () => {
    const selectAgente = document.getElementById("agente");
  
    const cargarAgentes = async () => {
      try {
        // Realizar una solicitud GET a la API
        const response = await fetch("http://127.0.0.1:3000/api/usuarios");
  
        // Verificar si la respuesta es válida
        if (!response.ok) {
          throw new Error(`Error al obtener los agentes: ${response.statusText}`);
        }
  
        // Convertir la respuesta en JSON
        const data = await response.json();
  
        // Iterar sobre los datos y agregar opciones al select
        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.Id_user; // Asignar chapa como valor
          option.textContent = `${item.name_user} - ${item.chapa}`; // Mostrar name_user y chapa
          selectAgente.appendChild(option);
        });
      } catch (error) {
        console.error("Error al cargar los agentes:", error);
      }
    };
  
    cargarAgentes();
  });
  