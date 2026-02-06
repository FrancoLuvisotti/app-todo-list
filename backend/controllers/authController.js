const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Ya existe un usuario con ese email' });
        }

        // 🚫 Nunca permitir crear ADMIN por registro
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashPassword,
            role: 'USER',
            status: 'ACTIVE'
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ token });

    } catch (error) {
        console.error('Error registro:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña requeridos' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        if (user.status === 'SUSPENDED') {
            return res.status(403).json({ message: 'Cuenta suspendida' });
        }

        if (user.status === 'DELETED') {
            return res.status(403).json({ message: 'Cuenta eliminada' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });

        user.lastLoginAt = new Date();
        await user.save();

    } catch (error) {
        console.error('Error login:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

module.exports = { register, login };
