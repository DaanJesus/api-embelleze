const {
    Double
} = require('bson');
const mongoose = require('mongoose');
require('dotenv').config();

const CartSchema = new mongoose.Schema({

    cartItem: [{
        data_order: {
            type: Date,
            default: Date.now
        },
        order_status: {
            type: String,
            default: "Pedido Efetuado"
        },
        order: [{
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Item"
            },
            quantity: {
                type: Number
            }
        }]
    }],
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;