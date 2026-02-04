const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'SUSPENDED', 'DELETED'],
        default: 'ACTIVE'
    }
},
    // createdAt: { solo guarda fecha de creacion
    //     type: Date,
    //     default: Date.now,
    // },
    // timestamps guarda
    // "createdAt": "fecha de creacion",
    // "updatedAt": "fecha de modificacion"
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

module.exports = User;