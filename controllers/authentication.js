const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
/////////////////////////////////////////
const ApiError = require("../utls/apiError");
const userModel = require("../models/userModel");
const sendEmail = require("../utls/sendEmial");

const generateToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SERCRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
// authentction
exports.signup = asyncHandler(async (req, res, next) => {
  // create user
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //   generate token
  const token = generateToken(user._id);

  res.status(201).json({
    data: user,
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  // check if  the email and password in body (vaildator)
  // check user exist & password is correct
  const user = await userModel.findOne({ email: req.body.email });
  const compare = await bcrypt.compare(req.body.password, user.password);
  if (!user || !compare) {
    throw new ApiError(401, "Incorrect email or password ");
  }
  //   genreate token
  const token = generateToken(user._id);
  // send res
  res.status(200).json({ data: user, token });
});
// make sure that user is loged in the system
exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Check if token exist, if exist get
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "You are not login, Please login to get access this route",
        401
      )
    );
  }

  // 2) Verify token (no change happens, expired token)
  const decoded = jwt.verify(token, process.env.JWT_SERCRET_KEY);

  // 3) Check if user exists
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("no user exist", 401));
  }

  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStmap = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    // password changed afetr token created (error)
    if (passwordChangedTimeStmap > decoded.iat) {
      return next(new ApiError("Password has been changed", 401));
    }
  }
  req.user = currentUser;
  next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError("you not allowed ", 403));
    }
    next();
    // access roles
    // access registerd user
  });
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // 1) Get user by email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  // 2) If user exist, Generate hash reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  // Save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  // Add expiration time for password reset code (10 min)
  user.passwordResetExpire = Date.now() + 10 * 60 * 1000;
  user.passwordVerified = false;

  await user.save();

  // 3) Send the reset code via email
  const message = `Hi ${user.name},\n We received a request to reset the password on your E-shop Account. \n ${resetCode} \n Enter this code to complete the reset. \n Thanks for helping us keep your account secure.\n The E-shop Team`;
  try {
    sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpire = undefined;
    user.passwordVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }

  res
    .status(200)
    .json({ status: "Success", message: "Reset code sent to email" });
});
exports.verifypassresetcode = asyncHandler(async (req, res, next) => {
  // get user based on reset code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetcode)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or Expired Reset Code", 400));
  }
  // reset code vaiid
  user.passwordVerified = true;
  await user.save();
  res.status(200).json({ status: "success", message: "Password verified!" });
});
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // user based on email
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No User Found with this Email!", 404));
  }
  // check if password verification is done
  if (!user.passwordVerified) {
    return next(new ApiError("Preset code not verified!", 400));
  }
  // up
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpire = undefined;
  user.passwordVerified = false;
  await user.save();
  // generate new token
  const token = generateToken(user._id);
  res.status(200).json({ token });
});
