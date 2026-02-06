const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || '123456';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado' });
    }

    // if (req.user.status !== 'ACTIVE') {
    //     return res.status(403).json({
    //     message: 'Usuario bloqueado'
    //     });
    // }


    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

module.exports = authenticate;
