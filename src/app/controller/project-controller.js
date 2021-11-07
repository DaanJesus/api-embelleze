//imports
const express = require('express');

//modules
const authMiddleware = require('../middleware/auth');
const Item = require('../models/item');
const multer = require('multer');
const multerConfig = require('../../config/multer');

const router = express.Router();

//const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

router.use(authMiddleware);

router.get('/item/promocao', async (req, res) => {

    try {

        const obj = []

        const item = await Item.find({
            promocional: true
        })

        item.forEach(item => {
            obj.push({
                "_id": item._id,
                "nome": item.nome,
                "tipo": item.tipo,
                "quantidade": item.quantidade,
                "valor": item.valor,
                "estoque": item.estoque,
                "promocional": item.promocional,
                "favorito": item.favorito,
                "capacidade": item.capacidade,
                "description": "Esse item é muit bom, compra ae!!!",
                "marca": item.marca,
                "avaliacao": item.avaliacao,
                "image": item.image
            })
        })

        return res.status(200).json({
            item: item,
        })

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar items'
        });
    }
});

router.get('/item/popular', async (req, res) => {

    try {

        const obj = []

        const item = await Item.find().sort({total_vendido: -1}).limit(10)

        item.forEach(item => {
            obj.push({
                "_id": item._id,
                "image": item.image,
                "estoque": item.estoque,
                "promocional": item.promocional,
                "nome": item.nome,
                "tipo": item.tipo,
                "quantidade": item.quantidade,
                "valor": item.valor,
                "marca": item.marca,
                "avaliacao": item.avaliacao,
                "description": "Esse item é muit bom, compra ae!!!"
            })
        })

        return res.status(200).json({
            item: obj,
        })

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar items'
        });
    }
});

router.post('/item/avaliacao', async (req, res) => {

    try {

        const { rating, id_item } = req.body

        const item = await Item.findOne({ _id: id_item })

        var total_rating = item.avaliacao.total_rating
        var total_avaliacoes = item.avaliacao.total_avaliacoes
        var total_vendido = item.avaliacao.total_vendido

        total_rating += rating
        total_avaliacoes += 1

        var media_rating = (total_rating / total_avaliacoes).toFixed(1)

        var avaliacao = {
            'avaliacao': {
                'total_rating': total_rating,
                'total_avaliacoes': total_avaliacoes,
                'media_rating': media_rating,
                'total_vendido': total_vendido,
            }
        }

        await Item.findOneAndUpdate({ _id: id_item }, avaliacao)

        const updated = await Item.findOne({ _id: id_item })

        return res.status(200).json(updated)

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar items'
        });
    }
})


router.get('/item/set_favorite', async (req, res) => {

    try {

        const obj = []

        const item = await Item.find({
            promocional: true
        })

        item.forEach(item => {
            obj.push({
                "_id": item._id,
                "image": item.image.url,
                "estoque": item.estoque,
                "promocional": item.promocional,
                "nome": item.nome,
                "tipo": item.tipo,
                "quantidade": item.quantidade,
                "valor": item.valor,
                "marca": item.marca,
                "avaliacao": item.avaliacao,
                "description": "Esse item é muit bom, compra ae!!!"
            })
        })

        return res.status(200).json({
            item: obj,
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
        const { type } = req.params

        console.log(type);

        let item = []

        if (type == "all") {

            item = await Item.find()
        } else {
            item = await Item.find({
                tipo: type
            })
        }

        const obj = []

        item.forEach(item => {
            obj.push({
                "_id": item._id,
                "image": item.image,
                "estoque": item.estoque,
                "promocional": item.promocional,
                "nome": item.nome,
                "tipo": item.tipo,
                "quantidade": item.quantidade,
                "valor": item.valor,
                "marca": item.marca,
                "avaliacao": item.avaliacao,
                "description": "Esse item é muito bom, compra ae!!!"
            })
        })

        return res.status(200).json({
            item: obj,
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