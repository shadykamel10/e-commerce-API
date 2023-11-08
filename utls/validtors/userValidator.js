const slugify = require("slugify");
const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const validatorMiddleware = require("../../middeleares/validatorMiddleware");
const userModel = require("../../models/userModel");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invaild email address"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),

  check("passwordConfirm").notEmpty().withMessage("confirmtion required"),

  check("imageCover").optional(),
  check("role").optional(),
  check("phone")
    .optional()

    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invaile phone number"),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
    check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invaild email address"),
    check("imageCover").optional(),
  check("role").optional(),
  check("phone")
    .optional()

    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invaile phone number"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  check("currentPassword")
    .notEmpty()
    .withMessage("currentPassword is required"),
  check("cofirmPassword").notEmpty().withMessage("cofirmPassword required"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .custom(async (val, { req }) => {
      // check password is correct
      // 1) Verify current password
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        throw new Error("Incorrect current password");
      }

      // 2) Verify password confirm
      if (val !== req.body.cofirmPassword) {
        throw new Error("Password Confirmation incorrect");
      }
      return true;
    }),
    

  validatorMiddleware,
];
