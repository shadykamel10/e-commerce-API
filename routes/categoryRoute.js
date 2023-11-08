const express = require("express");

const {
  getCateGory,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utls/validtors/categoryValidator");
const subcategoriesRoute = require("./subCategoryRoute");

const {
  getcaegories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controllers/categoryController");

const authentication = require("../controllers/authentication");

const router = express.Router();
// nested route : get subcategoru that belong to a category
// post  subcategories   to that  category

router.use("/:categoryId/subcategories", subcategoriesRoute);

router
  .route("/")
  .get(getcaegories)
  .post(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCateGory, getCategory)
  .patch(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authentication.protect,
    authentication.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );
module.exports = router;
