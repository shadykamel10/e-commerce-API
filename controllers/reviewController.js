const reviewModel = require("../models/reviewModel");
const factory = require("./controllerFactrory");

// nested route
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
  };

exports.getreviews = factory.getAll(reviewModel);

exports.getareview = factory.getOne(reviewModel);

exports.createreview = factory.createOne(reviewModel);
exports.updatereview = factory.updateOne(reviewModel);
exports.deletereview = factory.deleteOne(reviewModel);
