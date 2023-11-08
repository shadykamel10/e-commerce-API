const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utls/validtors/productValidator");

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProduoctImage,
  resizeProductImages,
} = require("../controllers/productController");


const authentication = require("../controllers/authentication");
const reviewRoute = require("./reviewsRoute")


const router = express.Router();
// nested route{products/adsfasf/reviews} : get reivews that belong to a product
// nested route : {prodcurs/asedfs/reviews/sadf} get a review that belong that category
// post  reivews   to that  product
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    uploadProduoctImage,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .patch(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    uploadProduoctImage,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authentication.protect,
    authentication.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
