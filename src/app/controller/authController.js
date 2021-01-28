const express = require('express');
const User = require('../models/user.js');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (req, res) => {

    const {
        email
    } = req.body;

    try {

        if (await User.findOne({
                email
            })) {
            return res.status(400).json({
                error: 'Este e-mail ja foi utilizado.'
            });
        }

        const user = await User.create(req.body);

        user.senha = undefined;

        console.log("A merda do usuário ai", user);

        return res.json({
            user,
            token: generateToken({
                id: user._id
            })
        });


    } catch (err) {
        return res.status(400).json({
            error: 'Falha ao registrar usuário.'
        });
    }
});

router.post('/authenticate', async (req, res) => {

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
            nome: user.nome,
            email: user.email,
            token: generateToken({
                id: user._id
            })
        });

    } catch (err) {
        console.log(err);
    }
})

router.post('/esqueceu_senha', async (req, res) => {
    const {
        email
    } = req.body;

    try {

        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                error: 'Usuário não encontrado.'
            });
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                tokenReseteSenha: token,
                expiresReseteSenha: now
            }
        });

        await mailer.sendMail({
            to: email,
            from: 'danilo25oliveira@gmail.com',
            template: 'auth/esqueceu_senha',
            subject: 'Alteração de senha',
            context: {
                token
            },
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: 'Não conseguimos enviar o token para o email'
                })
            }

            return res.json({
                message: "Token enviado com sucesso. Verifique seu email"
            });
        });


    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: 'Erro ao tentar trocar a senha, tente novamente.'
        });
    }
})

router.post('/resete_senha', async (req, res) => {

    console.log(req.body);

    const {
        email,
        token,
        senha
    } = req.body;

    try {
        const user = await User.findOne({
                email
            })
            .select('+tokenReseteSenha expiresReseteSenha');

        if (!user) {
            return res.status(400).json({
                error: 'Usuário não encontrado.'
            });
        }

        if (token !== user.tokenReseteSenha) {
            return res.status(400).json({
                error: 'Token inválido.'
            });

        }

        const now = new Date();

        if (now > user.expiresReseteSenha) {
            return res.status(400).json({
                error: 'Token expirado. Por favor, gere um novo.'
            });
        }

        user.senha = senha;

        await user.save();

        res.json({
            error: "Senha alterada com sucesso"
        });

    } catch (err) {
        res.status(400).json({
            error: 'Erro ao tentar trocar a senha, tente novamente.'
        })
    }

})

module.exports = app => app.use('/auth', router);