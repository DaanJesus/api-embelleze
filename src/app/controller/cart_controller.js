/**
 * @description      : 
 * @author           : Danilo
 * @group            : 
 * @created          : 03/05/2021 - 13:26:49
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 03/05/2021
 * - Author          : Danilo
 * - Modification    : 
 **/
//imports
const express = require('express');

//modules
const authMiddleware = require('../middleware/auth');
const Cart = require('../models/cart');
const Historic = require('../models/historic');
const prettyFormat = require('pretty-format');

const router = express.Router();

//const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

router.use(authMiddleware);

/* 
    Buy
*/
router.post('/create/:user_id', async (req, res) => {

    try {

        const {
            user_id
        } = req.params

        const {
            cartItem,
            address
        } = req.body

        console.log(prettyFormat(cartItem));

        let itens = [];

        cartItem.forEach(item => {
            itens.push({
                item: item.item._id,
                quantity: item.quantity
            })
        });

        let carrinho = {};

        carrinho = await Cart.findOne({
            user_id: user_id
        });

        if (carrinho == null) {

            carrinho = await Cart.create({
                cartItem: itens,
                address: address,
                user_id: user_id
            })

            await Historic.create({
                cartItem: itens,
                user_id: user_id
            })

        } else {

            if (carrinho.cartItem.length > 0) {

                carrinho = await Cart.findOneAndUpdate({
                    user_id: user_id
                }, {
                    $push: {
                        cartItem: itens
                    },
                    address: address
                })

                await Historic.findOneAndUpdate({
                    user_id: user_id
                }, {
                    $push: {
                        cartItem: itens
                    }
                })

            } else {

                carrinho = await Cart.findOneAndUpdate({
                    user_id: user_id
                }, {
                    cartItem: itens
                })

                await Historic.findOneAndUpdate({
                    user_id: user_id
                }, {
                    cartItem: itens
                })
            }

        }

        res.status(200).json("Pedido efetuado com sucesso.")

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao finalizar pedido'
        });
    }

});

router.get('/cart_user/:user_id', async (req, res) => {

    try {

        const {
            user_id
        } = req.params

        const userCarts = await Cart.findOne({
                user_id: user_id
            })
            .populate("cartItem")

        res.status(200).json({
            userCarts
        })

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao listar compras'
        });
    }

});

router.put('/encerrar_pedido/:id_user', async (req, res) => {

    try {
        const {
            id_user
        } = req.params

        const {
            item_id
        } = req.body

        const cart = await Cart.findOneAndUpdate({
            user_id: id_user
        }, {
            $pull: {
                cartItem: {
                    _id: item_id
                }
            }
        })

        res.json(cart)

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao finalizar pedido'
        });
    }

});

router.get('/list', async (req, res) => {

    try {

        const cart = await Cart.find().populate("user_id");

        res.json(cart)

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao listar pedidos'
        });
    }

});

router.get('/historic/:id_user', async (req, res) => {

    const {
        id_user
    } = req.params

    try {

        const cart = await Historic.findOne({
            user_id: id_user
        });

        res.json(cart)

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao listar histórico'
        });
    }

});

module.exports = app => app.use('/carts', router);