const asyncHandler = require("express-async-handler");

const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const brandyModel = require("../models/brandModel");
const ApiError = require("../utls/apiError");
const factory = require("./controllerFactrory");


const multerStorsge = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStorsge, fileFilter: multerFilter });
  
  exports.uploadBrandImage = upload.single("image");
  
  exports.resizeImage = asyncHandler(async (req, res, next) => {
    const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);
    req.body.image = filename; 
    next();
  });                 

exports.getBrands = factory.getAll(brandyModel);

exports.getaBrand = factory.getOne(brandyModel);

exports.createBrand = factory.createOne(brandyModel);
exports.updateBrand = factory.updateOne(brandyModel);
exports.deleteBrand = factory.deleteOne(brandyModel);
