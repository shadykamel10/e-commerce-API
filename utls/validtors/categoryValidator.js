const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middeleares/validatorMiddleware");

const getCateGory = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
const createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("category required")
    .isLength({ min: 3 })
    .withMessage("too short category name ")
    .isLength({ max: 32 })
    .withMessage("too long category name").custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];
const updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  body("name").optional().custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

module.exports = {
  getCateGory,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
