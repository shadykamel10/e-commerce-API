const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");


exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  // addtoset add a productId to wishlist  if prodcutId not exist
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product added to wishList",
    data: user.wishList,
  });
});

exports.removeProductToWishList = asyncHandler(async (req, res, next) => {
  // pull remove a productId from wishlist  if prodcutId not exist
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "product  removed from wishList",
    data: user.wishList,
  });
});

exports.gerWishedlistProducts = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate('wishList');
  res.status(200).json({
    status: "success",
    data: user.wishList,
  }); 
});
