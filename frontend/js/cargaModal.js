// Cargar contenido de los modales

fetch('../views/modals.html')
    .then(response => response.text())
    .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);

        initializeLogoutModal();
        initializeProfileModal();
        initializeRegisterModal();
    })
    .catch(error => console.error('Error al cargar modals.html:', error));

// ---------- REGISTRO ----------
function initializeRegisterModal() {
    const registerForm = document.getElementById('register-form');

    if (!registerForm) {
        console.warn('El formulario de registro no se encuentra');
        return;
    }

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const body = {
            username: document.getElementById('register-username').value,
            email: document.getElementById('register-email').value,
            password: document.getElementById('register-password').value
        };

        try {
            const response = await fetch(
                `${API_URL}/auth/register`, //render
                //'http://localhost:5000/auth/register', //local
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.message || 'Error al registrar usuario');
                return;
            }

            showAlert('Usuario registrado correctamente');

            bootstrap.Modal
                .getInstance(document.getElementById('register-modal'))
                .hide();

        } catch (error) {
            console.error('Error en registro:', error);
            showAlert('Error del servidor');
        }
    });
}


// ---------- PERFIL ----------
function initializeProfileModal() {
    const profileModalEl = document.getElementById('profile-modal');
    const profileForm = document.getElementById('profile-form');
    const deleteBtn = document.getElementById('delete-account-btn');
    const deleteModalEl = document.getElementById('deleteAccountModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteAccount');

    //funcion eliminar usuario

    deleteBtn.addEventListener('click', () => {
    new bootstrap.Modal(deleteModalEl).show();
    });

    confirmDeleteBtn.addEventListener('click', async () => {
        const password = document.getElementById('delete-account-password').value;
        const token = localStorage.getItem('jwtToken');

        if (!password) {
            showAlert('Debes ingresar tu contraseña');
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/users/me`, //render
                //'http://localhost:5000/users/me', //local
                {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (!response.ok) {
                showAlert(data.message);
                return;
            }

            showAlert('Cuenta eliminada correctamente');

            setTimeout(() => {
                localStorage.removeItem('jwtToken');
                window.location.href = './login.html';
            }, 2000);

        } catch (error) {
            console.error(error);
            showAlert('Error del servidor');
        }
    });

    if (!profileModalEl || !profileForm) {
        console.warn('Modal de perfil no existe');
        return;
    }

    // 🟢 Al abrir el modal → cargar datos
    profileModalEl.addEventListener('show.bs.modal', async () => {
        //console.log('MODAL ABIERTO');

        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const response = await fetch(
                `${API_URL}/users/me`, //render
                //'http://localhost:5000/users/me', //local
                {
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
        const response = await fetch(
            `${API_URL}/users/me`, //render
            //'http://localhost:5000/users/me', //local
            {
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
    }

// ---------- ALERTA GLOBAL ----------
function showAlert(message) {
    const modalBody = document.getElementById('alert-modal-body');
    if (!modalBody) {
        alert(message); // fallback por si el modal no existe
        return;
    }

    modalBody.textContent = message;

    const alertModalEl = document.getElementById('alert-modal');
    const alertModal = new bootstrap.Modal(alertModalEl);
    alertModal.show();
}