const express = require("express");

const {
  getcoupons,
  createcoupon,
  getacoupon,
  updatecoupon,
  deletecoupon,
} = require("../controllers/copounsController");
const authentication = require("../controllers/authentication");

const router = express.Router();

router
  .route("/")
  .get(getcoupons)
  .post(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    createcoupon
  );
router
  .route("/:id")
  .get(getacoupon)
  .patch(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    updatecoupon
  )
  .delete(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    deletecoupon
  );
module.exports = router;
