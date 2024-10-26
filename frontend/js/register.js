// Función para manejar el registro
async function handleRegister(event) {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    // Obtener los valores del formulario de registro
    const username = document.getElementById('register-username').value.trim(); 
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    // Validación simple de los campos
    if (!username || !email || !password) {
        alert('Por favor, completa todos los campos.');
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
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            const modal = bootstrap.Modal.getInstance(document.getElementById('register-modal'));
            modal.hide(); // Cerrar el modal al registrarse exitosamente
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`); // Mostrar mensaje de error
            console.error('Error en el registro:', errorData); // Log de error para depuración
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al registrarse. Intenta nuevamente.');
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