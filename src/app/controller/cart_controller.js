//imports
const express = require("express");

//modules
const prettyFormat = require("pretty-format");
const https = require("https");
const fetch = require("cross-fetch");

//models
const Cart = require("../models/cart");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");

//router
const router = express.Router();

//const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

router.use(authMiddleware);

/* 
    Buy
*/
router.post("/create/:user", async (req, res) => {
  try {
    const { user } = req.params;

    const { cartItem, address } = req.body;

    let itens = [];

    cartItem.forEach((item) => {
      itens.push({
        order: item.order,
      });
    });

    let carrinho = {};

    carrinho = await Cart.findOne({
      user: user,
    });

    if (carrinho == null) {
      carrinho = await Cart.create({
        cartItem: itens,
        address: address,
        user: user,
      });
    } else {
      carrinho = await Cart.findOneAndUpdate(
        {
          user: user,
        },
        {
          $push: {
            cartItem: itens,
          },
        }
      );
    }

    if (carrinho != null) {
      let user_name = await User.findOne({
        _id: user,
      });

      let adm = await User.findOne({
        nome: "ADM",
      });

      let data = {
        notification: {
          title: "Pedido Efetuado.",
          body: `${user_name.nome}, obrigado por comprar na Embelleze. Você pode ver detalhes da compra e o status da entrega em 'Meus Pedidos'.`,
        },
        registration_ids: [user_name.token_device],
      };

      let data_adm = {
        notification: {
          title: "Novo Pedido.",
          body: `Você tem novos pedidos no aplicativo. Entre para verificar.`,
        },
        registration_ids: [adm.token_device],
      };

      fetch("https://fcm.googleapis.com/fcm/send", {
        method: "POST",
        headers: {
          Authorization: `key=${process.env.KEY_PUSH}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data, data_adm),
      })
        .then((res) => {
          console.log(res.status);
          //res.status(200).send("Notification send succesfully");
        })
        .catch((err) => {
          //res.status(400).send("Something went wrong");
          console.log(err);
        });
    }

    res.status(200).json("Pedido efetuado com sucesso.");
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      error: "Erro ao finalizar pedido",
    });
  }
});

router.get("/order_user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    const userCarts = await Cart.findOne({
      user: _id,
    }).populate("cartItem.order.item");

    var items = [];

    userCarts.cartItem.forEach((item) => {
      items.push(item);
    });

    res.status(200).json({ cart: items });
  } catch (err) {
    console.log(err);

    return res.status(400).send({
      error: "Erro ao listar itens",
    });
  }
});

router.put("/encerrar_pedido/:id_user", async (req, res) => {
  try {
    const { id_user } = req.params;

    const { item_id } = req.body;

    const cart = await Cart.findOneAndUpdate(
      {
        user: id_user,
      },
      {
        $pull: {
          cartItem: {
            _id: item_id,
          },
        },
      }
    );

    res.json(cart);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      error: "Erro ao finalizar pedido",
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const cart = await Cart.find()
      .populate("user")
      .populate("cartItem.order.item");

    res.status(200).json({
      cart,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      error: "Erro ao listar pedidos",
    });
  }
});

module.exports = (app) => app.use("/carts", router);
