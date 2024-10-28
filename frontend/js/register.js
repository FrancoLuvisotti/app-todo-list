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

// Función para manejar el registro
async function handleRegister(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario de registro
    const username = document.getElementById('register-username').value.trim(); 
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    // Validación simple de los campos
    if (!username || !email || !password) {
        showAutoCloseModal('Por favor, completa todos los campos.', 'Error');
        return;
    }

    // Crear el objeto de datos para enviar
    const registerData = { username, email, password };

    try {
        // Hacer la solicitud de registro al backend
        const response = await fetch('http://localhost:5000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        });

        // Manejar la respuesta
        if (response.ok) {
            showAutoCloseModal('Registro exitoso. Ahora puedes iniciar sesión.', 'Exito');
            const modal = bootstrap.Modal.getInstance(document.getElementById('register-modal'));
            modal.hide(); // Cerrar el modal al registrarse exitosamente
        } else {
            const errorData = await response.json();
            showAutoCloseModal(`Error: ${errorData.message}`, 'Error'); // Mostrar mensaje de error
            console.error('Error en el registro:', errorData); // Log de error para depuración
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        showAutoCloseModal('Ocurrió un error al registrarse. Intenta nuevamente.', 'Error');
    }
}

// Añadir el evento al formulario de registro
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.error("El formulario de registro no se encuentra.");
    }
});