document.addEventListener("DOMContentLoaded", () => {
  
    const agentesTableBody = document.getElementById("agentesTableBody");
  
    const cargarAgentes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:3000/api/usuarios");
  
        if (!response.ok) {
          throw new Error(`Error al obtener los agentes: ${response.statusText}`);
        }
  
        const data = await response.json();
  
        data.forEach((item, index) => {
          // Agregar cada agente a la tabla, usando index+1 para el contador
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name_user}</td>
            <td>${item.chapa}</td>
          `;
          agentesTableBody.appendChild(newRow);
        });
      } catch (error) {
        console.error("Error al cargar los agentes:", error);
      }
    };
  
    cargarAgentes();
  });
  