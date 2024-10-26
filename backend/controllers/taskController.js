const Task = require('../models/task');
const mongoose = require('mongoose');

// Crear una tarea
const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const userId = req.userId; // Obtenido del middleware de autenticación
        //const taskId = req.params.id

        //Verifico que los datos sean recibidos
        //console.log('Datos recibidos en taskController crear tarea:', {title, description, userId, taskId});

        if (!title || !description) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Crear la nueva tarea asociada al usuario
        const newTask = new Task({
            userId: userId,
            title,
            description,
            status: 'pending' // o como manejes el estado inicial
        });

        await newTask.save();

        res.status(201).json({ message: 'Tarea creada exitosamente', task: newTask });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Obtener todas las tareas del usuario autenticado
const getTasks = async (req, res) => {
    try {
        const userId = req.userId; // Obtenido del middleware de autenticación
        const tasks = await Task.find({ userId });

        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Marcar una tarea como completada
const completeTask = async (req, res) => {
    //console.log('Complete task endpoint hit!');
    //console.log('taskId:', req.params.id);
    
    const taskId = req.params.id; // ID de la tarea desde la URL
    const userId = req.userId; // ID del usuario desde el middleware

    try {
        // Buscar la tarea por ID y asegurarse de que pertenezca al usuario
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        // Actualizar el estado de la tarea a completada
        task.status = 'completed';
        task.completeAt = new Date();
        await task.save();
        res.status(200).json({ message: 'Tarea completada exitosamente', task });

    } catch (error) {
        console.error('Error al completar tarea:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Actualizar una tarea por su ID
const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const taskId = req.params.id;
        const userId = req.userId;

        //Verifico que los datos sean recibidos
        //console.log('Datos recibidos en taskController actualizar tarea:', {taskId, userId});

        // Verificar si la tarea pertenece al usuario autenticado
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status || task.status;

        await task.save();

        res.status(200).json({ message: 'Tarea actualizada exitosamente', task });
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// Eliminar una tarea por su ID
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.userId;

        // Verificar si la tarea pertenece al usuario autenticado
        const task = await Task.findOneAndDelete({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }

        res.status(200).json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = {
    createTask,
    getTasks,
    completeTask,
    updateTask,
    deleteTask
};