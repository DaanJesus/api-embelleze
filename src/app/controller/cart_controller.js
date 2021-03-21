//imports
const express = require('express');

//modules
const authMiddleware = require('../middleware/auth');
const Cart = require('../models/cart');

const router = express.Router();

//const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

router.use(authMiddleware);

/* 
    Buy
*/
router.post('/creat/:user_id', async (req, res) => {

    console.log(req.body);

    try {

        const {
            user_id
        } = req.params

        const body = req.body

        const cart = await Cart.create({
            ...body,
            username: user_id
        })
        //await cart.populate("products").execPopulate();

        res.status(200).json({
            cart,
            message: "Produto adicionado ao carrinho"
        })

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao adicionar item ao carrinho'
        });
    }

});

router.get('/cart_user/:user_id', async (req, res) => {

    console.log(req.params);

    try {

        const {
            user_id
        } = req.params

        const userCarts = await Cart.find({
                username: user_id,
                status: false
            })
            .populate("products")

        res.status(200).json(userCarts)

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao listar compras'
        });
    }

});

router.put('/encerrar_pedido/:cart_id', async (req, res) => {

    console.log(req.file, req.body);

    try {
        const {
            cart_id
        } = req.params

        const cart = await Cart.findOneAndUpdate({
            _id: cart_id
        }, {
            status: true
        });

        res.json({
            message: "Pedido finalizado com sucesso"
        })

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao finalizar pedido'
        });
    }

});

router.get('/list', async (req, res) => {

    try {

        const cart = await Cart.find();

        res.json(cart)

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao listar pedidos'
        });
    }

});

module.exports = app => app.use('/carts', router);