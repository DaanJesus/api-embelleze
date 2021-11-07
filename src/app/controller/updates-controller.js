//imports
const express = require('express');
//modules
const authMiddleware = require('../middleware/auth');
const Item = require('../models/item');

const router = express.Router();

router.use(authMiddleware);

const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

router.post('/item/update', async (req, res) => {

    try {

        const all = await Item.find()

        all.forEach(async item => {

            var i = 0

            var vendido = (Math.random() * (1000 - 1) + 1).toFixed(0)
            var avaliacoes = (Math.random() * (vendido - 1) + 1).toFixed(0)
            var rating = 0

            while (i < avaliacoes) {

                var gerado = (Math.random() * (5 - 1) + 1)

                rating = rating + gerado

                i++
            }

            var rating_filter = rating.toFixed(0)

            var media = (rating_filter / avaliacoes).toFixed(1)

            await Item.findOneAndUpdate(
                { _id: item._id },
                {
                    $set: {
                        /* 'avaliacao': {
                            'total_vendido': vendido,
                            'total_avaliacoes': avaliacoes,
                            'total_rating': rating_filter,
                            'media_rating': media
                        } */

                        'descricao': "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley"
                    }
                },
                {
                    upsert: false,
                    multi: true
                }
            )

        })

        const item = await Item.find()

        return res.status(200).json(
            item
        )

    } catch (err) {
        return res.status(400).send({
            error: 'Erro ao carregar items'
        });
    }
});

module.exports = app => app.use('/updates', router);