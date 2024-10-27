const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const bodyParser = require('body-parser');
const authenticate = require('./middlewares/authMiddleware');
const path = require('path');

require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 5000; // Usa el puerto definido en .env o el 5000 por defecto

// Middleware
// app.use(cors({
//     origin: 'https://app-todo-list-1.onrender.com', //URl del frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//     allowedHeaders: ['Conten-Type', 'Authorization'],
//     credentials: true,
// }));

//habilitar cors
const corsOption = {
    origin: 'https://app-todo-list-1.onrender.com', //URl del frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: true,
};

app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para parsear formularios URL-encoded
app.use(express.static(path.join(__dirname, '../frontend')));
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.type('text/css');
    }
    if (req.url.endsWith('.js')) {
        res.type('text/javascript');
    }
    next();
})
// app.use((req, res, next) => {
//     res.set('Cache-Control', 'no-store, no-caches, must-revalidate, private');
//     next();
// })

// Conectar a la base de datos MongoDB
connectDB();

// Rutas
app.use('/auth', authRoutes); // Rutas de autenticación
app.use('/tasks', authenticate, taskRoutes); // Rutas de tareas

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/views/index.html'));
});

app.get('/tasks', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/views/tasks.html'));
});

app.get('/css/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, '../frontend/css', file));
});

app.get('/js/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, '../frontend/js', file));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});