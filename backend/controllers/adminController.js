const User = require('../models/user');
const Task = require('../models/task');

/* =========================
 //  Helpers
========================= */
const countActiveAdmins = async () => {
    return User.countDocuments({
        role: 'ADMIN',
        status: 'ACTIVE'
    });
};

/* =========================
  // Controllers
========================= */
const INACTIVE_DAYS = 1;

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const statusFilter = req.query.status || 'ALL';

        const now = new Date();
        const inactiveLimitDate = new Date();
        inactiveLimitDate.setDate(now.getDate() - INACTIVE_DAYS);

        /* =========================
        //   Match dinámico
        ========================= */
        const match = {};

        if (statusFilter === 'ACTIVE') {
            match.status = 'ACTIVE';
        }

        if (statusFilter === 'SUSPENDED') {
            match.status = 'SUSPENDED';
        }

        if (statusFilter === 'INACTIVE') {
            match.status = 'ACTIVE';
            match.lastLoginAt = { $lt: inactiveLimitDate };
        }

        const users = await User.aggregate([
            { $match: match },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'tasks'
                }
            },
            {
                $addFields: {
                    tasksCount: { $size: '$tasks' },
                    daysInactive: {
                        $cond: [
                            { $ifNull: ['$lastLoginAt', false] },
                            {
                                $floor: {
                                    $divide: [
                                        { $subtract: [now, '$lastLoginAt'] },
                                        1000 * 60 * 60 * 24
                                    ]
                                }
                            },
                            null
                        ]
                    }
                }
            },
            {
                $project: {
                    password: 0,
                    __v: 0,
                    tasks: 0
                }
            }
        ]);

        const totalUsers = await User.countDocuments(match);

        res.json({
            users,
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
