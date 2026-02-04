const User = require('../models/user');
const Task = require('../models/task');

/* =========================
   Helpers
========================= */
const countActiveAdmins = async () => {
    return User.countDocuments({
        role: 'ADMIN',
        status: 'ACTIVE'
    });
};

/* =========================
   Controllers
========================= */
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();

        const users = await User.find()
            .select('-password -__v')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const usersWithTasks = await Promise.all(
            users.map(async user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                status: user.status,
                tasksCount: await Task.countDocuments({ user: user._id })
            }))
        );

        res.json({
            users: usersWithTasks,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });

    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

/* =========================
   Admin actions
========================= */
const suspendUser = async (req, res) => {
    try {
        if (req.params.id === req.userId) {
            return res.status(400).json({
                message: 'No podés suspender tu propia cuenta'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.role === 'ADMIN') {
            const admins = await countActiveAdmins();
            if (admins <= 1) {
                return res.status(400).json({
                    message: 'No se puede suspender el único administrador del sistema'
                });
            }
        }

        await User.findByIdAndUpdate(req.params.id, { status: 'SUSPENDED' });
        res.json({ message: 'Usuario suspendido' });

    } catch (error) {
        console.error('Error suspendiendo usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const activateUser = async (req, res) => {
    try {
        if (req.params.id === req.userId) {
            return res.status(400).json({
                message: 'No podés modificar tu propia cuenta'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await User.findByIdAndUpdate(req.params.id, { status: 'ACTIVE' });
        res.json({ message: 'Usuario activado' });

    } catch (error) {
        console.error('Error activando usuario:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.role === 'ADMIN') {
            return res.status(400).json({
                message: 'No se puede eliminar un usuario administrador'
            });
        }

        user.status = 'DELETED';
        await user.save();

        res.json({ message: 'Usuario eliminado' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


/* ========================= */
module.exports = {
    getAllUsers,
    suspendUser,
    activateUser,
    deleteUser
};
