// Cargar contenido de los modales
fetch('../views/modals.html')
.then(response => response.text())
.then(data => {
    // Insertar el contenido en el body
    document.body.insertAdjacentHTML('beforeend', data);

    // Inicializar eventos del modal de cerrar sesión
    initializeLogoutModal();
})
.catch(error => console.error('Error al cargar modals.html:', error));

// Función para inicializar eventos del modal de cerrar sesión
function initializeLogoutModal() {
const logoutButton = document.getElementById("logoutButton");
const confirmLogoutButton = document.getElementById("confirmLogout");

if (logoutButton) {
    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();
        const logoutModalElement = document.getElementById("logoutModal");
        if (logoutModalElement) {
            const logoutModal = new bootstrap.Modal(logoutModalElement);
            logoutModal.show();
        }
    });
} else {
    console.warn("El botón 'Cerrar Sesión' no está presente en esta página.");
}

if (confirmLogoutButton) {
    confirmLogoutButton.addEventListener("click", function () {
        localStorage.removeItem("jwtToken");
        window.location.href = "./login.html";
    });
} else {
    console.warn("El botón 'Sí, cerrar sesión' no está presente en esta página.");
}
}