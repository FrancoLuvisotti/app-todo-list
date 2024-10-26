const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const authenticate = require('./middlewares/authMiddleware');

require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 5000; // Usa el puerto definido en .env o el 5000 por defecto

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', //URl del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear formularios URL-encoded
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-caches, must-revalidate, private');
    next();
})

// Conectar a la base de datos MongoDB
connectDB();

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/tasks', authenticate, taskRoutes); // Rutas de tareas

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});