// const mongoose = require('mongoose');
// const connectDB = require('./config/database');
// require('dotenv').config(); // Asegúrate de tener acceso a tus variables de entorno

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(async () => {
//         console.log('Conectado a MongoDB');

//         // Eliminar el índice de username
//         try {
//         await mongoose.connection.db.collection('users').dropIndex('username_1');
//         console.log('Índice eliminado con éxito');
//         } catch (error) {
//         console.error('Error al eliminar el índice:', error.message);
//         }

//         // Cerrar la conexión a la base de datos
//         mongoose.connection.close();
//     })
//     .catch((err) => console.log('Error al conectar a MongoDB:', err));