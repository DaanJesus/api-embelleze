//imports
const express = require("express");
const { ObjectId } = require("mongodb");

//modules
const authMiddleware = require("../middleware/auth");
const Track = require("../models/cart");

const router = express.Router();

//const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

router.use(authMiddleware);

router.get("/:user_id/:order_id", async (req, res) => {
  try {
    const { user_id, order_id } = req.params;

    let track = await Track.findOne(
      { user: user_id },
      { cartItem: { $elemMatch: { _id: order_id } } }
    );

    if (track.cartItem.length == 0) {
      res.status(200).send({ error: "Nenhum pedido foi encontrado" });
      return;
    }

    res.status(200).json(track);
  } catch (err) {
    return res.status(500).send({
      error: "Erro ao rastrear pedido! Tente em alguns instantes.",
    });
  }
});

router.post("/update/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    console.log(req.body);

    const { status, id_order } = req.body;

    let track = await Track.findOneAndUpdate(
      {
        user: user_id,
        cartItem: { $elemMatch: { _id: id_order } } 
      },
      { $set: { "cartItem.$.order_status": status } }
    );

    res.status(200).json({message: "Pedido atualizado com sucesso!"});
    
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Erro ao rastrear pedido! Tente em alguns instantes.",
    });
  }
});

module.exports = (app) => app.use("/track", router);
