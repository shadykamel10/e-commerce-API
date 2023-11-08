const express = require("express");

const {
  addProductToCart,
  getCart,
  removeCartItem,
  cleatCart,
  updateCartItem,
  coupon,
} = require("../controllers/cartController");
const authentication = require("../controllers/authentication");

const router = express.Router();

router
  .route("/")
  .get(authentication.protect, authentication.allowedTo("user"), getCart)
  .post(
    authentication.protect,
    authentication.allowedTo("user"),
    addProductToCart
  )
  .delete(authentication.protect, authentication.allowedTo("user"), cleatCart);

router
  .route("/coupon")
  .put(authentication.protect, authentication.allowedTo("user"), coupon);

router
  .route("/:itemId")
  .delete(
    authentication.protect,
    authentication.allowedTo("user"),
    removeCartItem
  )
  .put(
    authentication.protect,
    authentication.allowedTo("user"),
    updateCartItem
  );

module.exports = router;
