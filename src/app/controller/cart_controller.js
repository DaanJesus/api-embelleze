//imports
const express = require("express");

//modules
const authMiddleware = require("../middleware/auth");
const Cart = require("../models/cart");
const Historic = require("../models/historic");
const prettyFormat = require("pretty-format");

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
      console.log("aqui");

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
    });

    var items = []

    userCarts.cartItem.forEach(item => {

    items.push(item)
    })


    res.status(200).json({ cart: items});

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
    const cart = await Cart.find().populate("user").populate("cartItem.item");

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

router.get("/historic/:id_user", async (req, res) => {
  const { id_user } = req.params;

  try {
    const cart = await Historic.findOne({
      user: id_user,
    })
      .populate("cartItem.item")
      .populate("user");

    res.json(cart);
  } catch (err) {
    console.log(err);
    return res.status(400).send({
      error: "Erro ao listar histórico",
    });
  }
});

module.exports = (app) => app.use("/carts", router);
