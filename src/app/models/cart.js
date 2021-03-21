const mongoose = require('mongoose');
require('dotenv').config();

const CartSchema = new mongoose.Schema({

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    username: {
        type: mongoose.Schema.Types.ObjectId,
        required: "User"
    },
    address: {
        cep: {
            type: String,
            required: true
        },
        bairro: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: true
        },
        rua: {
            type: String,
            required: true
        }
    },
    status: {
        type: Boolean,
        default: false
    }

});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;