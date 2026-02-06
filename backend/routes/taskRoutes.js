const express = require('express');
const { 
    createTask, 
    getTasks, 
    completeTask, 
    updateTask, 
    deleteTask 
} = require('../controllers/taskController');
const router = express.Router();

// Ruta para crear una nueva tarea (POST /tasks)
router.post('/', createTask);

// Ruta para obtener todas las tareas del usuario autenticado (GET /tasks)
router.get('/', getTasks);

// Ruta para completar una tarea existente
router.patch('/:id/complete', completeTask);

// Ruta para actualizar una tarea existente (PUT /tasks/:id)
router.put('/:id', updateTask);

// Ruta para eliminar una tarea (DELETE /tasks/:id)
router.delete('/:id', deleteTask);

module.exports = router;