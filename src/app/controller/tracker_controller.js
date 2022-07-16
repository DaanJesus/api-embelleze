//imports
const express = require("express");
const { ObjectId } = require("mongodb");

//modules
const authMiddleware = require("../middleware/auth");
const Track = require("../models/cart");
const User = require("../models/user");
const https = require("https");
const fetch = require("cross-fetch");

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

    res.status(200).json({order_status: track.cartItem[0].order_status});
  } catch (err) {
    return res.status(500).send({
      error: "Erro ao rastrear pedido! Tente em alguns instantes.",
    });
  }
});

router.post("/update/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const { status, id_order } = req.body;

    let track = await Track.findOneAndUpdate(
      {
        user: user_id,
        cartItem: { $elemMatch: { _id: id_order } },
      },
      { $push: { "cartItem.$.order_status": status } }
    )

    let user = await User.findOne({_id: user_id})

    let data = {
      data: {
        title: status.title,
        body: status.description,
        id_order: id_order
      },
      registration_ids: [user.token_device],
    };

    fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        Authorization: `key=${process.env.KEY_PUSH}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log(res.status);
        //res.status(200).send("Notification send succesfully");
      })
      .catch((err) => {
        //res.status(400).send("Something went wrong");
        console.log(err);
      });

    res.status(200).json({ message: "Pedido atualizado com sucesso!" });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: "Erro ao rastrear pedido! Tente em alguns instantes.",
    });
  }
});

module.exports = (app) => app.use("/track", router);
