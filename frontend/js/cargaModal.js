// Cargar contenido de los modales
fetch('../views/modals.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);

        initializeLogoutModal();
        initializeProfileModal();
    })
    .catch(error => console.error('Error al cargar modals.html:', error));


// ---------- PERFIL ----------
function initializeProfileModal() {
    const profileModalEl = document.getElementById('profile-modal');
    const profileForm = document.getElementById('profile-form');

    if (!profileModalEl || !profileForm) {
        console.warn('Modal de perfil no existe');
        return;
    }

    // 🟢 Al abrir el modal → cargar datos
    profileModalEl.addEventListener('show.bs.modal', async () => {
        console.log('MODAL ABIERTO');

        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:5000/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo obtener el usuario');
            }

            const user = await response.json();

            document.getElementById('profile-username').value = user.username;
            document.getElementById('profile-email').value = user.email;

            // limpiar passwords
            document.getElementById('current-password').value = '';
            document.getElementById('new-password').value = '';

        } catch (error) {
            console.error('Error cargando perfil:', error);
        }
    });

    // 🟢 Al enviar el formulario → actualizar perfil
    profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('jwtToken');
    if (!token) return;

    const body = {
        username: document.getElementById('profile-username').value,
        email: document.getElementById('profile-email').value
    };

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;

    if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
    }

    try {
        const response = await fetch('http://localhost:5000/users/me', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            showAlert(data.message || 'Error al actualizar perfil');
            return;
        }

        // 🔐 SI CAMBIÓ LA CONTRASEÑA
        if (data.passwordChanged) {
            showAlert(
                'Contraseña actualizada correctamente. Se cerrará la sesión.'
            );

            bootstrap.Modal.getInstance(profileModalEl).hide();

            setTimeout(() => {
                localStorage.removeItem('jwtToken');
                window.location.href = './login.html';
            }, 2000);

        } else {
            showAlert('Perfil actualizado correctamente');
            bootstrap.Modal.getInstance(profileModalEl).hide();
        }

    } catch (error) {
        console.error('Error actualizando perfil:', error);
        showAlert('Error del servidor');
    }
    }); 
}



// ---------- LOGOUT ----------
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
    }

    if (confirmLogoutButton) {
        confirmLogoutButton.addEventListener("click", function () {
        localStorage.removeItem("jwtToken");
        window.location.href = "./login.html";
        });
    }
    }


    // ---------- ABRIR PERFIL ----------
    function openProfileModal() {
    const modalEl = document.getElementById('profile-modal');
    if (!modalEl) return;

    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    function showAlert(message) {
    const modalBody = document.getElementById('alert-modal-body');
    modalBody.textContent = message;

    const alertModal = new bootstrap.Modal(
        document.getElementById('alert-modal')
    );
    alertModal.show();
}

}
