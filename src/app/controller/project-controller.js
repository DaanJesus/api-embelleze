//imports
const express = require('express');
//modules
const authMiddleware = require('../middleware/auth');
const Item = require('../models/item');
const Cart = require('../models/cart');
const multer = require('multer');
const multerConfig = require('../../config/multer');

const router = express.Router();

//const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

router.use(authMiddleware);

router.get('/item/promocao', async (req, res) => {

    try {

        const item = await Item.find({
            promocional: true
        })

        return res.status(200).json({
            item: item
        })

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar items'
        });
    }
});


/* 
    Get type
*/

router.get('/item/:type', async (req, res) => {


    try {
        const type = req.params.type

        const item = await Item.find({
            tipo: type
        })

        return res.status(200).json({
            item: item
        })

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar itens'
        });
    }
});

/* 
    Get Estoque
*/

router.get('/item/estoque', async (req, res) => {

    try {

        const item = await Item.find({
            estoque: true
        })

        return res.status(200).json({
            item: item
        })

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar items'
        });
    }
});

/* 
    List
*/

router.get('/itens', async (req, res) => {

    try {

        const item = await Item.find()

        return res.status(200).json({
            item: item
        })

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar items'
        });
    }
});

/* 
    Show
*/

router.get('/item/:itemId', async (req, res) => {
    try {

        const item = await Item.findById(req.params.itemId);

        return res.send({
            item
        })

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar item'
        })
    }

});

/* 
    Create
*/
router.post('/cadastrar_item', multer(multerConfig).single('file'), async (req, res) => {

    console.log(req.file, req.body);

    try {
        const {
            originalname: nome_file,
            size,
            key,
            location: url = ""
        } = req.file;

        const {
            nome,
            tipo,
            quantidade,
            valor,
            estoque,
            promocional,
            linha,
            capacidade,
            descricao,
            marca,
        } = req.body

        const item = await Item.create({
            nome,
            tipo,
            quantidade,
            valor,
            estoque,
            promocional,
            linha,
            capacidade,
            descricao,
            marca,
            image: {
                nome_file,
                size,
                key,
                url
            }
        });

        res.json({
            message: "Item cadastrado com sucesso"
        })

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao cadastrar item'
        });
    }

});

/* 
    Update
*/
router.put('/atualizar_item/:itemId', async (req, res) => {

    const {
        nome,
        tipo,
        quantidade,
        valor,
        estoque,
        marca,
        promocional
    } = req.body

    try {

        const item = await Item.findByIdAndUpdate(req.params.itemId, {
            nome,
            tipo,
            quantidade,
            valor,
            estoque,
            marca,
            promocional
        });

        res.json(item)

    } catch (err) {
        return res.status(400).send({
            error: `Erro ao atualizar o item ${nome}`
        });
    }

});

/* 
    Delete
*/
router.delete('/delete_item/:itemId', async (req, res) => {
    try {

        const item = await Item.findById(req.params.itemId);
        await item.remove();

        return res.json({
            message: `O item ${item.nome} foi deletado com sucesso`
        })

    } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao deletar item'
        })
    }

});

module.exports = app => app.use('/produtos', router);