let allTasks = []; // Para almacenar todas las tareas

// Función para obtener y mostrar tareas
async function fetchTasks() {
    const token = localStorage.getItem('jwtToken'); // Obtener el token desde localStorage

    if (!token) {
        window.location.href = '../views/index.html';
    }

    try {
        const response = await fetch('https://todo-app-list.onrender.com/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluyendo el token JWT
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al obtener tareas', errorData);
            alert(`Error: ${errorData.message}`);
            return;
        }

        const tasks = await response.json();

        if (!Array.isArray(tasks)) {
            throw new TypeError('Se esperaba un arreglo de tareas');
        }

        allTasks = tasks; // Almacena todas las tareas
        displayTasks(allTasks); // Mostrar todas las tareas por defecto
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        alert('Ocurrió un error al cargar las tareas. Intenta nuevamente.');
    }
}

// Función para mostrar tareas en el DOM
function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpiar la lista antes de agregar las tareas

    tasks.forEach(task => {
        //Formatear las fechas
        const createdAt = moment(task.createdAt).format('DD/MM/YYYY'); //fecha de inicio
        //fecha de finalizacion o pendiente
        const completedAt = task.status === 'completed' ? moment(task.completeAt).format('DD/MM/YYYY') : '<span class="pendiente">Pendiente</span>';

        const taskItem = document.createElement('div');
        taskItem.className = 'card mb-3 d-flex flex-column';

        taskItem.innerHTML = `
            <div class="card-body d-flex flex-column">
                <h5 class="card-title ${task.status === 'completed' ? 'task-completed' : ''}">
                    ${task.title} <br>
                    <h6>
                        Inicio: ${createdAt}<br><br>
                        Finalizada: ${completedAt}
                    </h6>
                </h5>
                <p class="card-text">${task.description}</p>
                <!--<span class="badge ${task.status === 'completed' ? 'bg-success' : 'bg-danger'}">
                    ${task.status === 'completed' ? 'Completada' : 'Pendiente'}
                </span>-->
                <div class="d-flex flex-wrap gap-2 mt-auto">
                    <button class="btn btn-success btn-sm" onclick="completeTask('${task._id}')">Completar</button>
                    <button class="btn btn-warning btn-sm" onclick="openEditModal('${task._id}', '${task.title}', '${task.description}')">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTask('${task._id}')">Eliminar</button>
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
    });
}

const navLinks = document.querySelectorAll('.nav-link');
    
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        const filter = link.id; 
        filterTasks(filter);
    });
});

// Función para filtrar tareas
function filterTasks(filter) {
    let filteredTasks;
    switch (filter) {
        case 'completed':
            filteredTasks = allTasks.filter(task => task.status === 'completed');
            break;
        case 'pending':
            filteredTasks = allTasks.filter(task => task.status === 'pending');
            break;
        case 'all':
        default:
            filteredTasks = allTasks; // Mostrar todas las tareas
            break;
    }
    displayTasks(filteredTasks); // Mostrar las tareas filtradas
}

// Función para agregar una nueva tarea
async function addTask(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const title = document.getElementById('task-title').value.trim();
    const description = document.getElementById('task-description').value.trim();

    if (!title || !description) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const newTask = { title, description };
    const token = localStorage.getItem('jwtToken') // Obtener el token desde localStorage

    try {
        const response = await fetch('https://todo-app-list.onrender.com/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluyendo el token JWT
            },
            body: JSON.stringify(newTask)
        });

        if (response.ok) {
            alert('Tarea agregada con éxito!');
            fetchTasks(); // Actualizar la lista de tareas
            // Cerrar modal de agregar tarea
            const modalElement = document.getElementById('add-task-modal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
            document.getElementById('add-task-form').reset();

        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al agregar tarea:', error);
        alert('Ocurrió un error al agregar la tarea. Intenta nuevamente.');
    }
}

// Función para completar una tarea
async function completeTask(taskId) {
    const token = localStorage.getItem('jwtToken') // Obtener el token desde localStorage

    try {
        const response = await fetch(`https://todo-app-list.onrender.com/tasks/${taskId}/complete`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluyendo el token JWT
            },
        });

        if (response.ok) {
            alert('Tarea marcada como completada!');
            fetchTasks(); // Actualizar la lista de tareas
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al completar la tarea:', error);
        alert('Ocurrió un error al completar la tarea. Intenta nuevamente.');
    }
}

// Función para abrir el modal de edición
function openEditModal(taskId, title, description) {
    document.getElementById('edit-task-id').value = taskId;
    document.getElementById('edit-task-title').value = title;
    document.getElementById('edit-task-description').value = description;
    const editModal = new bootstrap.Modal(document.getElementById('edit-task-modal'));
    editModal.show();
}

// Función para editar una tarea
async function editTask(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario

    const taskId = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value.trim();
    const description = document.getElementById('edit-task-description').value.trim();

    if (!title || !description) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const updatedTask = { title, description };
    const token = localStorage.getItem('jwtToken') // Obtener el token desde localStorage

    try {
        const response = await fetch(`https://todo-app-list.onrender.com/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Incluyendo el token JWT
            },
            body: JSON.stringify(updatedTask)
        });

        if (response.ok) {
            alert('Tarea editada con éxito!');
            fetchTasks(); // Actualizar la lista de tareas
            const editModal = bootstrap.Modal.getInstance(document.getElementById('edit-task-modal'));
            editModal.hide(); // Cerrar el modal
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al editar tarea:', error);
        alert('Ocurrió un error al editar la tarea. Intenta nuevamente.');
    }
}

// Función para eliminar una tarea
async function deleteTask(taskId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        return; // Cancelar la acción si el usuario no confirma
    }

    const token = localStorage.getItem('jwtToken') // Obtener el token desde localStorage

    try {
        const response = await fetch(`https://todo-app-list.onrender.com/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // Incluyendo el token JWT
            }
        });

        if (response.ok) {
            alert('Tarea eliminada con éxito!');
            fetchTasks(); // Actualizar la lista de tareas
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Ocurrió un error al eliminar la tarea. Intenta nuevamente.');
    }
}

// Función para cerrar sesión
function logout() {
    // Eliminar jwt del localStorage
    localStorage.removeItem('jwtToken');
    // Redirigir a la página del login
    window.location.href = './login.html';
}

// Al cargar la página, obtener las tareas
document.addEventListener('DOMContentLoaded', fetchTasks);