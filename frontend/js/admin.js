let currentPage = 1;
const limit = 5;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('jwtToken');

    if (!token) {
        window.location.href = './login.html';
        return;
    }

    const user = getUserFromToken();

    if (!user || user.role !== 'ADMIN') {
        window.location.href = './login.html';
        return;
    }

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('jwtToken');
        window.location.href = './login.html';
    });

    loadUsers();
});

async function loadUsers() {
    const token = localStorage.getItem('jwtToken');

    try {
        const res = await fetch(
            `http://localhost:5000/admin/users?page=${currentPage}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!res.ok) {
            throw new Error('Error al cargar usuarios');
        }

        const data = await res.json();

        renderUsers(data.users);

        totalPages = data.totalPages;
        updatePaginationUI();

    } catch (error) {
        console.error(error);
        alert('Error cargando usuarios');
    }
}

function updatePaginationUI() {
    document.getElementById('pageInfo').innerText =
        `Página ${currentPage} de ${totalPages}`;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function renderUsers(users) {
    const tbody = document.getElementById('users-table');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}">
                    ${user.role}
                </span>
            </td>
            <td>
                <span class="badge ${
                    user.status === 'ACTIVE' ? 'bg-success' :
                    user.status === 'SUSPENDED' ? 'bg-warning' : 'bg-dark'
                }">
                    ${user.status}
                </span>
            </td>
            <td>${user.tasksCount}</td>
            <td>
                ${renderActions(user)}
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function renderActions(user) {
    if (user.status === 'DELETED') {
        return `<span class="text-muted">Sin acciones</span>`;
    }

    let buttons = '';

    if (user.status !== 'SUSPENDED') {
        buttons += `
            <button class="btn btn-sm btn-warning me-1"
                onclick="suspendUser('${user._id}')">
                Suspender
            </button>
        `;
    }

    if (user.status !== 'ACTIVE') {
        buttons += `
            <button class="btn btn-sm btn-success me-1"
                onclick="activateUser('${user._id}')">
                Activar
            </button>
        `;
    }

    buttons += `
        <button class="btn btn-sm btn-danger"
            onclick="deleteUser('${user._id}')">
            Eliminar
        </button>
    `;

    return buttons;
}


async function suspendUser(userId) {
    await adminAction(userId, 'suspend');
}

async function activateUser(userId) {
    await adminAction(userId, 'activate');
}

async function deleteUser(userId) {
    if (!confirm('¿Eliminar usuario definitivamente?')) return;
    await adminAction(userId, 'delete');
}

async function adminAction(userId, action) {
    const token = localStorage.getItem('jwtToken');

    try {
        const res = await fetch(
            `http://localhost:5000/admin/users/${userId}/${action}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Error en la acción');
        }

        alert(data.message);
        loadUsers();

    } catch (error) {
        alert(error.message);
    }
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadUsers();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        loadUsers();
    }
});

