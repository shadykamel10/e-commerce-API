const express = require("express");

const {
  addProductToWishList,
  removeProductToWishList,
  gerWishedlistProducts,
} = require("../controllers/wishListController");
const authentication = require("../controllers/authentication");

const router = express.Router();

router
  .route("/")
  .post(
    authentication.protect,
    authentication.allowedTo("user"),
    addProductToWishList
  )
  .get(
    authentication.protect,
    authentication.allowedTo("user"),
    gerWishedlistProducts
  );

router.delete(
  "/:productId",
  authentication.protect,
  authentication.allowedTo("user"),
  removeProductToWishList
);

module.exports = router;
