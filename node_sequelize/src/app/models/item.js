const mongoose = require('../../database');
const bcrypt = require('bcryptjs');
const { mongo } = require('../../database');

const ItemSchema = new mongoose.Schema({

    nome: {
        type: String,
        require: true
    },
    tipo: {
        type: String,
        require: true
    },
    quantidade: {
        type: Number
    },
    estoque: {
        type: Boolean,
        require: true,
        default: false
    },
    marca: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Marca',
        require: true
    }
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;