//imports
const express = require('express');
//modules
const authMiddleware = require('../middleware/auth');
const Item = require('../models/item');
const multer = require('multer');
const multerConfig = require('../../config/multer');

const router = express.Router();

router.use(authMiddleware);

/* 
    List
*/
router.get('/itens', async (req, res) => {

    try {

        const item = await Item.find()

        console.log({item: item});

        return res.status(200).json({item: item})

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
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao carregar item'
        })
    }

});

/* 
    Create
*/
router.post('/cadastrar_item', multer(multerConfig).single('file'), async (req, res) => {

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
            marca,
            promocional
        } = req.body

        const item = await Item.create({
            nome,
            tipo,
            quantidade,
            valor,
            estoque,
            marca,
            promocional,
            image: {
                nome_file,
                size,
                key,
                url
            }
        });

        res.json(item)

    } catch (err) {
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