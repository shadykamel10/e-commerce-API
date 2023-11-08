const asyncHandler = require('express-async-handler')
const couponsModelModel = require("../models/couponsModel");
const factory = require("./controllerFactrory");
const ApiError = require("../utls/apiError");

exports.getcoupons = factory.getAll(couponsModelModel);

exports.getacoupon = factory.getOne(couponsModelModel);

exports.createcoupon = factory.createOne(couponsModelModel);
exports.updatecoupon = factory.updateOne(couponsModelModel);
exports.deletecoupon = asyncHandler(async(req,res,next)=> {
    const {id} = req.params;
    const document = await couponsModelModel.findByIdAndDelete(id);
    if(!document){
        return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();

})