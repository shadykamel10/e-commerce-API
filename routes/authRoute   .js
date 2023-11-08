const express = require("express");
const {
  signupValidator,
  loginValidator,
} = require("../utls/validtors/authValidator ");

const {
  signup,
  login,
  forgotPassword,
  verifypassresetcode,
  resetPassword
} = require("../controllers/authentication");

const router = express.Router();

router.route("/signup").post(signupValidator, signup);
router.route("/login").post(loginValidator, login);
router.route("/forgetpasswprd").post(forgotPassword);
router.route("/verifyresetcode").post(verifypassresetcode);
router.route("/resetpassword").put(resetPassword);

module.exports = router;
 