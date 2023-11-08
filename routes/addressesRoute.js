const express = require("express");

const {
  addAddress,
  removeAdress,
  gerAdresss,
} = require("../controllers/addressController");
const authentication = require("../controllers/authentication");

const router = express.Router();



router
  .route("/")
  .post(authentication.protect, authentication.allowedTo("user"), addAddress)
  .get(authentication.protect, authentication.allowedTo("user"), gerAdresss);

router.delete(
  "/:addressId",
  authentication.protect,
  authentication.allowedTo("user"),
  removeAdress
);

module.exports = router;
