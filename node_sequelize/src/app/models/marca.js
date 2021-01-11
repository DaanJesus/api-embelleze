const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const { mongo } = require('../../database');

const MarcaSchema = new mongoose.Schema({

    nome: {
        type: String,
        require: true
    },
    itens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        require: true
    }]
});

const Marca = mongoose.model('Marca', MarcaSchema);

module.exports = Marca;