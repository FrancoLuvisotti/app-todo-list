// Middleware para verificar
const jwt = require('jsonwebtoken'); 
const JWT_SECRET = process.env.JWT_SECRET || '123456';

const authenticate = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado de autorización

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verificar el token
        req.userId = decoded.userId; // Almacenar el ID del usuario en el objeto de solicitud
        //req.params.id = decoded._id.toString();
        next(); // Continuar al siguiente middleware o ruta
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = authenticate;