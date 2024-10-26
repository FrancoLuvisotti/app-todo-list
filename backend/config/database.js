const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // Conexión a la base de datos usando la URI de MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error al conectar a MongoDB: ${error.message}`);
        process.exit(1); // Salir del proceso en caso de error
    }
};

module.exports = connectDB;