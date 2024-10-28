function showAutoCloseModal(message, title = "Mensaje") {
    // Configurar el contenido del modal
    document.getElementById('alertModalLabel').textContent = title;
    document.getElementById('alert-modal-body').textContent = message;

    // Mostrar el modal
    const alertModal = new bootstrap.Modal(document.getElementById('alert-modal'));
    alertModal.show();

    // Cerrar el modal automáticamente después de 3 segundos
    setTimeout(() => {
        alertModal.hide();
    }, 2000); // 2000 milisegundos = 3 segundos
}

// Función para manejar el inicio de sesión
async function handleLogin(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Validación simple de los campos
    if (!email || !password) {
        showAutoCloseModal('Por favor, completa todos los campos.', 'Error');
        return;
    }

    // Crear el objeto de datos para enviar
    const loginData = { email, password };
    //console.log('Enviando datos de login', loginData);

    try {
        // Hacer la solicitud de inicio de sesión al backend
        const response = await fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        //console.log('Respuesta del servidor', response);

        // Manejar la respuesta
        if (response.ok) {
            const data = await response.json();
            const token = data.token; // Obtener el token JWT
            localStorage.setItem('jwtToken', token); // Guardar el token en localStorage
            showAutoCloseModal('Inicio de sesión exitoso!', 'Exito');
            window.location.href = '../views/index.html'; // Redirigir a la página principal
        } else {
            const errorData = await response.json();
            showAutoCloseModal(`Error: ${errorData.message}`, 'Error'); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        showAutoCloseModal('Ocurrió un error al iniciar sesión. Intenta nuevamente.', 'Error');
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