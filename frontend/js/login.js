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
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAutoCloseModal('Completa todos los campos', 'Error');
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/auth/login`, //render
            //'http://localhost:5000/auth/login', //local
            {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showAutoCloseModal(data.message, 'Error');
            return;
        }

        localStorage.setItem('jwtToken', data.token);

        const user = getUserFromToken();

        if (user.role === 'ADMIN') {
            window.location.href = '../views/admin.html';
        } else {
            window.location.href = '../views/index.html';
        }

    } catch (error) {
        console.error(error);
        showAutoCloseModal('Error del servidor', 'Error');
    }
}

// Toggle mostrar / ocultar contraseña
document.addEventListener("DOMContentLoaded", () => {

    // ===== LOGIN FORM =====
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // ===== PASSWORD STRENGTH =====
    const passwordInput = document.getElementById("login-password");
    const strengthBar = document.getElementById("password-strength-bar");
    const strengthText = document.getElementById("password-strength-text");

    if (passwordInput && strengthBar && strengthText) {

        passwordInput.addEventListener("input", function () {
            const value = passwordInput.value;
            let score = 0;

            if (value.length >= 8) score++;
            if (/[A-Z]/.test(value)) score++;
            if (/[0-9]/.test(value)) score++;
            if (/[^A-Za-z0-9]/.test(value)) score++;

            updateStrengthUI(score);
        });

        function updateStrengthUI(score) {
            const levels = ["Muy débil", "Débil", "Media", "Fuerte"];
            const colors = ["bg-danger", "bg-warning", "bg-info", "bg-success"];

            strengthBar.className = "progress-bar";
            strengthBar.style.width = (score * 25) + "%";

            if (score === 0) {
                strengthText.textContent = "";
                strengthBar.style.width = "0%";
                return;
            }

            strengthBar.classList.add(colors[score - 1]);
            strengthText.textContent = levels[score - 1];
        }
    }

});

// Añadir el evento al formulario de inicio de sesión
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error("El formulario de inicio de sesión no se encuentra.");
    }
});