const Cart = require("../model/cart.model");

exports.getCart = async (req, res, next) => {
  const userID = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userID }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.addToCart = (req, res, next) => {};

exports.deleteToCart = (req, res, next) => {};

exports.updateToCart = (req, res, next) => {};
