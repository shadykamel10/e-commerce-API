const asyncHandler = require("express-async-handler");

const multer = require("multer");

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const productModel = require("../models/productModel");
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

exports.uploadProduoctImage = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push(imageName);
      })
    );

    next();
  }
});

exports.getProducts = factory.getAll(productModel, "product");

exports.getProduct = factory.getOne(productModel, "reviews");

exports.createProduct = factory.createOne(productModel);
exports.updateProduct = factory.updateOne(productModel);

exports.deleteProduct = factory.deleteOne(productModel);
