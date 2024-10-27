// Función para manejar el inicio de sesión
async function handleLogin(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Validación simple de los campos
    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Crear el objeto de datos para enviar
    const loginData = { email, password };
    console.log('Enviando datos de login', loginData);

    try {
        // Hacer la solicitud de inicio de sesión al backend
        const response = await fetch('https://todo-app-list-dvov.onrender.com/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        console.log('Respuesta del servidor', response);

        // Manejar la respuesta
        if (response.ok) {
            const data = await response.json();
            const token = data.token; // Obtener el token JWT
            localStorage.setItem('jwtToken', token); // Guardar el token en localStorage
            alert('Inicio de sesión exitoso!');
            window.location.href = 'https://todo-app-list-dvov.onrender.com/tasks'; // Redirigir a la página principal
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al iniciar sesión. Intenta nuevamente.');
    }
}

// Añadir el evento al formulario de inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error("El formulario de inicio de sesión no se encuentra.");
    }
});