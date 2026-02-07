const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/database');
const authenticate = require('./middlewares/authMiddleware');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const autoSuspendInactiveUsers = require('./services/autoSuspendUsers');


const app = express();
const PORT = process.env.PORT || 5000;

/* =====================
// 📦 Parsers
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
// 🔐 Seguridad global
===================== */

// CORS controlado
app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'https://app-todo-list-frontend.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Headers seguros
app.use(helmet());

// Anti XSS
app.use(xss());

// Rate limit global
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // 10 intentos
    message: {
        message: 'Demasiados intentos, probá más tarde'
    }
});

// Anti NoSQL Injection
app.use(mongoSanitize({
    replaceWith: '_'
}));

// No cache
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});


/* =====================
 //🚀 Rutas
===================== */
app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);
app.use('/auth', authRoutes);
app.use('/tasks', authenticate, taskRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);

app.use((err, req, res, next) => {
    console.error('🔥 Error no manejado:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
});

// Health check
app.get('/', (req, res) => {
    res.send('API is running...');
});

/* =====================
 //🔌 DB + Server
===================== */
connectDB();

connectDB().then(() => {
    autoSuspendInactiveUsers();
});

app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
});
