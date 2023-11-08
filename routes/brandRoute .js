const express = require("express");
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utls/validtors/brandValidator ");

const {
  getBrands,
  createBrand,
  getaBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controllers/brandController ");
const authentication = require("../controllers/authentication");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getaBrand)
  .patch(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authentication.protect,
    authentication.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
