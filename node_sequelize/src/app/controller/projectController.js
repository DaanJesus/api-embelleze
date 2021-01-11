const express = require('express');
const authMiddleware = require('../middleware/auth');
const Marca = require('../models/marca');
const Item = require('../models/item');

const router = express.Router();

router.use(authMiddleware);


/* 
    List
*/
router.get('/', async (req, res) => {

    try {

        const marca = await Marca.find()
            .populate('itens');

        return res.send({ marca })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar marcas' })
    }
});

/* 
    Show
*/

router.get('/:marcaId', async (req, res) => {
    try {

        const marca = await Marca.findById(req.params.marcaId);

        return res.send({ marca })

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao carregar marca' })
    }

});

/* 
    Create
*/
router.post('/', async (req, res) => {

    try {

        const { nome, itens } = req.body;

        const marca = await Marca.create({ nome });

        await Promise.all(itens.map(async item => {
            const itemMarca = new Item({ ...item, marca: marca._id });

            await itemMarca.save();
            marca.itens.push(itemMarca);
        }));

        await marca.save();

        return res.send({ marca });

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao cadastrar marca' });
    }

});

/* 
    Update
*/
router.put('/:marcaId', async (req, res) => {

    try {

        const { nome, itens } = req.body;

        const marca = await Marca.findByIdAndUpdate(req.params.marcaId, {
            nome
        }, { new: true });

        marca.itens = [];
        await Item.remove({ marca: marca._id })

        await Promise.all(itens.map(async item => {
            const itemMarca = new Item({ ...item, marca: marca._id });

            await itemMarca.save();
            marca.itens.push(itemMarca);
        }));

        await marca.save();

        return res.send({ marca });

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao cadastrar marca' });
    }

});

/* 
    Delete
*/
router.delete('/:marcaId', async (req, res) => {
    try {

        await Marca.findByIdAndRemove(req.params.marcaId);

        return res.send()

    } catch (err) {
        return res.status(400).send({ error: 'Erro ao deletar marca' })
    }

});

module.exports = app => app.use('/marcas', router);