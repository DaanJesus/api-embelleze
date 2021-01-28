const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({

    nome: {
        type: String,
        require: true
    },
    celular: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        require: true,
        lowercase: true
    },
    senha: {
        type: String,
        require: true,
        select: false
    },
    cep: {
        type: String,
        require: true
    },
    bairro: {
        type: String,
        require: true
    },
    numero: {
        type: String,
        require: true
    },
    rua: {
        type: String,
        require: true
    },
    tokenReseteSenha: {
        type: String,
        select: false
    },
    expiresReseteSenha: {
        type: Date,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;

    next();
})

const User = mongoose.model('User', UserSchema);

module.exports = User;