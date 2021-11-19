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

const mongoose = require('mongoose');
require('dotenv').config();

const HistoricSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cartItem: [{
        
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        },
        quantity: {
            type: Number
        }
    }]
});

const Historic = mongoose.model('Historic', HistoricSchema);

module.exports = Historic;