document.addEventListener("DOMContentLoaded", () => {
    const btnAgente = document.getElementById("btn_agente");
  
    btnAgente.addEventListener("click", async () => {
      // Obtener los valores de los inputs y quitar espacios en blanco
      const name = document.getElementById("agente_name").value.trim();
      const chapa = document.getElementById("chapa").value.trim();
  
      // Validar que ambos campos estén completos
      if (!name || !chapa) {
        alert("Por favor, complete ambos campos");
        return;
      }
  
      try {
        // Realizar la petición POST a la API
        const response = await fetch("http://127.0.0.1:3000/api/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name_user: name, chapa: chapa })
        });
  
        // Verificar si la respuesta es exitosa
        if (!response.ok) {
          throw new Error(`Error al insertar usuario: ${response.statusText}`);
        }
  
        // Obtener la respuesta en formato JSON
        const data = await response.json();
  
        // Mostrar mensaje de éxito
        alert(`Usuario insertado, ID: ${data.newUserId}`);
  
        // Limpiar los inputs después de insertar
        document.getElementById("agente_name").value = "";
        document.getElementById("chapa").value = "";
      } catch (error) {
        console.error("Error al insertar usuario:", error);
        alert("Hubo un error al insertar el usuario");
      }
    });
  });
  