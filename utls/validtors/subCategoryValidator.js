const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middeleares/validatorMiddleware");

const getSubCateGoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
const creatSubeCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 2 })
    .withMessage("too short category name ")
    .isLength({ max: 32 })
    .withMessage("too long category name").custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must be long to main category")
    .isMongoId()
    .withMessage("Invalid category id format")
    ,
  validatorMiddleware,
];
const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

module.exports = {
  getSubCateGoryValidator,
  creatSubeCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
