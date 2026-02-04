const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authMiddleware');
const adminOnly = require('../middlewares/adminMiddleware');

const {
    getAllUsers,
    suspendUser,
    activateUser,
    deleteUser
} = require('../controllers/adminController');

// 🔐 Seguridad global
router.use(auth);
router.use(adminOnly);

// 📌 Rutas
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/activate', activateUser);
router.put('/users/:id/delete', deleteUser);

module.exports = router;
