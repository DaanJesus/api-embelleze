/**
    * @description      : 
    * @author           : Danilo
    * @group            : 
    * @created          : 03/05/2021 - 17:19:43
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 03/05/2021
    * - Author          : Danilo
    * - Modification    : 
**/
const {
    Double
} = require('bson');
const mongoose = require('mongoose');
require('dotenv').config();

const CartSchema = new mongoose.Schema({

    cartItem: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        },
        quantity: {
            type: Number
        }
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
    }

});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;