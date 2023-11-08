const asyncHandler = require("express-async-handler");

const cartModel = require("../models/cartModel");

const prodcutModel = require("../models/productModel");

const couponModel = require("../models/couponsModel");

const ApiError = require("../utls/apiError");

const calctotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res) => {
  const { productId, color } = req.body;
  const product = await prodcutModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    // create cart fot logged user with product
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;

      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart,  push product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  // calc  total cart price
  calctotalPrice(cart);

  await cart.save();
  res.status(200).json({
    statys: "success",
    message: "product added to cart",
    cart,
  });
});

exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("no cart found for tis user", 404));
  }
  res.status(200).json({
    result: cart.cartItems.length,
    status: "success",
    cart,
  });
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  // get cart based on logged in user
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  if (!cart) {
    return next(new ApiError("no cart found for tis user", 404));
  }

  calctotalPrice(cart);
  cart.save();
  res.status(200).json({
    result: cart.cartItems.length,
    status: "success",
    cart,
  });
});

exports.cleatCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("no cart found for tis user", 404));
  }
  // get item index to change quantity
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`no item found for this ${req.params.itemId}`, 404)
    );
  }
  calctotalPrice(cart);
  await cart.save();
  res.status(200).json({
    result: cart.cartItems.length,
    status: "success",
    cart,
  });
});

exports.coupon = asyncHandler(async (req, res, next) => {
  // get coupon form body
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }
  const cart = await cartModel.findOne({ user: req.user._id });
  const totalprice = cart.totalPrice;
  // calc price after discount
  const totalpriceafterdiscount = (
    totalprice -
    (totalprice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalpriceafterdiscount;
  await cart.save();

  res.status(200).json({
    result: cart.cartItems.length,
    status: "success",
    cart,
  });
});
