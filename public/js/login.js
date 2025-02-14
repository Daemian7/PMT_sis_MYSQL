document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar recargar la página al enviar el formulario

    // Capturar los datos ingresados
    const usuario = document.getElementById("email").value;
    const passw = document.getElementById("password").value;

    try {
        // Realizar una solicitud POST a la API
        const response = await fetch("http://127.0.0.1:3000/api/session/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ usuario, passw }), // Enviar usuario y contraseña como JSON
        });

        if (response.ok) {
            // Si las credenciales son correctas, redirigir automáticamente
            window.location.href = "http://127.0.0.1:3000/index"; // Redirigir
        } else {
            // En caso de error en las credenciales, no hacer nada
            // (puedes manejar esto con algún otro feedback si lo deseas)
        }
    } catch (err) {
        // Manejar errores de red
        console.error("Error al iniciar sesión:", err);
        alert("Ocurrió un error al intentar iniciar sesión.");
    }
});
