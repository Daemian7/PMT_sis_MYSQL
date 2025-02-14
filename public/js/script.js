document.getElementById("agregarArticulo").addEventListener("click", () => {
    const select = document.getElementById("articulos");
    const selectedValue = select.value;
    const selectedText = select.options[select.selectedIndex].text;
  
    if (selectedValue) {
      const lista = document.getElementById("listaArticulos");
      const div = document.createElement("div");
      div.className = "article-item";
  
      div.innerHTML = `
        <span>${selectedText}</span>
        <button class="button-remove">X</button>
      `;
  
      lista.appendChild(div);
  
      div.querySelector(".button-remove").addEventListener("click", () => {
        lista.removeChild(div);
      });
  
      select.value = "";
    }
  });
  