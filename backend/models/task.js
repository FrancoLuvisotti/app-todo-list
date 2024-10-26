const mongoose = require('mongoose');

// Definición del esquema de la tarea
const taskSchema = new mongoose.Schema({
    userId: {
        //type: String,
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Referencia al modelo de usuario
    },
    title: {
        type: String,
        required: true,
        trim: true // Eliminar espacios en blanco al principio y al final
    },
    description: {
        type: String,
        required: true,
        trim: true // Eliminar espacios en blanco al principio y al final
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending' // Estado predeterminado
    },
}, {
    timestamps: true // Agrega timestamps para createdAt y updatedAt
});

// Exportar el modelo
module.exports = mongoose.model('Task', taskSchema);