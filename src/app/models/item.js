const mongoose = require('../../database');
const aws = require('aws-sdk')
require('dotenv').config();
const path = require('path')
const fs = require('fs')
const {
    promisify
} = require('util')

const s3 = new aws.S3();

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
    valor: {
        type: Number,
        require: true,
    },
    estoque: {
        type: Boolean,
        require: true,
        default: false
    },
    promocional: {
        type: Boolean,
        require: true,
        default: false
    },
    linha: {
        type: String,
        require: true
    },
    capacidade: {
        type: String,
        require: true
    },
    descricao: {
        type: String,
        require: true
    },
    marca: {
        type: String,
        require: true
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

ItemSchema.pre("save", function () {
    //console.log("Chegou aqui", this.image.key);
    if (!this.image.url) {
        this.image.url = `${process.env.APP_URL}/files/${this.image.key}`
    }
});

ItemSchema.pre("remove", function () {
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

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;