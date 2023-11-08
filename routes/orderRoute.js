const express = require("express");

const {
  createCashOrder,
  getAllOrders,
  getaOrder,
  filterOrderForLogerUser,
  updateOrderToDelivered,
  updateOrderToPaid,
  checkoutSession
} = require("../controllers/orderController");
const authentication = require("../controllers/authentication");

const router = express.Router();

router.use(authentication.protect);

router
  .route("/checkout-session/:cartId")
  .get(
    authentication.protect,
    authentication.allowedTo("user"),
    checkoutSession
  );

router
  .route("/")
  .get(
    authentication.protect,
    authentication.allowedTo("admin", "manger", "user"),
    filterOrderForLogerUser,
    getAllOrders
  );
router.route("/:id").get(getaOrder);
router
  .route(":/cartId")
  .post(authentication.allowedTo("user"), createCashOrder);
router
  .route("/:id/pay")
  .put(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    updateOrderToPaid
  );
router
  .route("/:id/deliver")
  .put(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    updateOrderToDelivered
  );
module.exports = router;
