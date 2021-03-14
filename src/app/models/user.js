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
    },
    image: {
        nome_file: String,
        size: Number,
        key: String,
        url: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
});

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.senha, 10);
    this.senha = hash;

    if (!this.image.url) {
        this.image.url = `${process.env.IP_LOCAL}/files/${this.image.key}`
    }

    next();
})

UserSchema.pre("remove", function () {
    //console.log("Chegou aqui", this.image.key);
    if (process.env.STORAGE_TYPE == 's3') {
        return s3.deleteObject({
            Bucket: 'uploadforsale',
            Key: this.image.key
        }).promise();
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "..", "tmp", "uploads", this.image.key))
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;