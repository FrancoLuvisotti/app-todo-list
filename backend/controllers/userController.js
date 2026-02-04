const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

const updateMe = async (req, res) => {
    try {
        const userId = req.userId;
        const { username, email, currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 🟢 Actualizar username / email
        if (username) user.username = username;
        if (email) user.email = email;

        // 🔐 Cambio de contraseña (opcional)
        let passwordChanged = false;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({
                    message: 'Debes ingresar la contraseña actual'
                });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: 'La contraseña actual es incorrecta'
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            passwordChanged = true;
        }


        await user.save();

        res.json({
            message: 'Perfil actualizado correctamente',
            passwordChanged,
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = {
    getMe,
    updateMe
};

