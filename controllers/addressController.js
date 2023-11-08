const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");

exports.addAddress = asyncHandler(async (req, res, next) => {
  // addtoset add a AdressId to wishlist  if prodcutId not exist
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Adress added successfully",
    data: user.addresses,
  });
});

exports.removeAdress = asyncHandler(async (req, res, next) => {
  // pull remove a AdressId from wishlist  if prodcutId not exist
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Adress  removed successfully",
    data: user.addresses,
  });
});

exports.gerAdresss = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
