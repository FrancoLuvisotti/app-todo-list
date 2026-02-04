// require('dotenv').config();
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const User = require('../models/user');

// mongoose.connect(process.env.MONGO_URI)
//     .then(async () => {
//         console.log('Mongo Atlas conectado');

//         const exists = await User.findOne({ role: 'ADMIN' });
//         if (exists) {
//             console.log('Ya existe un admin');
//             process.exit(0);
//         }

//         const hash = await bcrypt.hash('admin123', 10);

//         await User.create({
//             username: 'admin',
//             email: 'admin@app.com',
//             password: hash,
//             role: 'ADMIN',
//             status: 'ACTIVE'
//         });

//         console.log('Admin creado correctamente');
//         process.exit(0);
//     })
//     .catch(err => {
//         console.error('Error Mongo:', err);
//         process.exit(1);
//     });
