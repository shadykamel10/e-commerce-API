const asyncHandler = require("express-async-handler");

const secret =
  "sk_test_51O9seeHiUPHHsd5snFaidmVZqRCWVOzhCRDUy2fTGs8B9R0EY4olXC3HKTrnSMRBcQgb7y6yH0WKRqtUOqaEzvKX00VwzsW0sZ";

const stripe = require("stripe")(secret);

const orderModel = require("../models/orderModel");

const factory = require("./controllerFactrory");

const ApiError = require("../utls/apiError");

const cartModel = require("../models/cartModel");

const productModel = require("../models/productModel");

// cash method

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // get cart based on id
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  // get order price based on cart price (check if is any coupon apply or not)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // create order with cash method
  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  // after make order decrement product quantity and increment sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product }, // find items to be updated
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    // cleart cart
    await cartModel.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLogerUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
exports.getAllOrders = factory.getAll(orderModel);

exports.getaOrder = factory.getOne(orderModel);

exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("order not found for  this user", 404));
  }
  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("order not found for  this user", 404));
  }
  // update order to paid
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: "success", data: updatedOrder });
});

////////////////////////////////////////////////

// payment provider
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // app setting
  const taxPrice = 0;
  const shippingPrice = 0;
  // get cart based on id
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  // get order price based on cart price (check if is any coupon apply or not)
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    // currency: "egp",
    line_items: [
      {
        // name: "Order",
        price_data: { product_data:{name: req.user.name}, unit_amount: totalOrderPrice * 100, currency: "egp" }, 
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  // send session to res
  res.status(200).json({ status: "success", data: session });
});
