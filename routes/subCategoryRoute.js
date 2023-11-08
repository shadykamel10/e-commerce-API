const express = require("express");

const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setcategoyIdParam,
  createFilterObj
} = require("../controllers/subCcategooryController");
//////////////////
//valodators
const {
  creatSubeCategoryValidator,
  getSubCateGoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utls/validtors/subCategoryValidator");

const authentication = require("../controllers/authentication");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .get(createFilterObj,getSubCategories)
  .post(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    setcategoyIdParam,
    creatSubeCategoryValidator,
    createSubCategory
  );

router
  .route("/:id")
  .get(getSubCateGoryValidator, getSubCategory)
  .put(
    authentication.protect,
    authentication.allowedTo("admin", "manger"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authentication.protect,
    authentication.allowedTo("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );
module.exports = router;
