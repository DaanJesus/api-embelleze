const express = require('express');
const User = require('../models/user.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const multerConfig = require('../../config/multer');
const multer = require('multer');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', multer(multerConfig).single('file'), async(req, res) => {

    try {

        const {
            originalname: nome_file,
            size,
            key,
            location: url = ""
        } = req.file;

        const {
            nome,
            celular,
            email,
            senha,
            cep,
            bairro,
            numero,
            rua,
            cpf
        } = req.body;

        if (await User.findOne({
                email
            })) {
            return res.status(400).json({
                error: 'Este e-mail ja foi utilizado.'
            });
        }

        const user = await User.create({
            nome,
            celular,
            email,
            senha,
            cep,
            bairro,
            numero,
            rua,
            image: {
                nome_file,
                size,
                key,
                url
            },
            cpf
        });

        user.senha = undefined;

        return res.json({
            user,
            token: generateToken({
                id: user._id
            })
        });


    } catch (err) {
        console.log(err);
        return res.status(400).json({
            error: 'Falha ao registrar usuário.'
        });
    }
});

router.post('/authenticate', async(req, res) => {

    try {

        const {
            email,
            senha
        } = req.body;

        const user = await User.findOne({
            email
        }).select('+senha');

        if (!user) {
            return res.status(400).json({
                error: 'Usuário não encontrado.'
            });
        }

        if (!await bcrypt.compare(senha, user.senha)) {
            return res.status(400).json({
                error: 'Senha inválida.'
            });
        }

        user.senha = undefined;

        res.status(200).json({
            user,
            token: generateToken({
                id: user._id
            })
        });

    } catch (err) {
        console.log(err);
    }
});

module.exports = app => app.use('/auth', router);