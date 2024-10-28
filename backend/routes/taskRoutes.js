const express = require('express');
const { createTask, getTasks, completeTask, updateTask, deleteTask } = require('../controllers/taskController');
const authenticate = require('../middlewares/authMiddleware'); // Middleware para verificar el token
const router = express.Router();

// Ruta para crear una nueva tarea (POST /tasks)
router.post('/', authenticate, createTask);

// Ruta para obtener todas las tareas del usuario autenticado (GET /tasks)
router.get('/', authenticate, getTasks);

// Ruta para completar una tarea existente
router.patch('/:id/complete', authenticate, completeTask);

// Ruta para actualizar una tarea existente (PUT /tasks/:id)
router.put('/:id', authenticate, updateTask);

// Ruta para eliminar una tarea (DELETE /tasks/:id)
router.delete('/:id', authenticate, deleteTask);

module.exports = router;