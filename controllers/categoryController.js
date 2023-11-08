const multer = require("multer");

const sharp = require("sharp");

const asyncHandeller = require("express-async-handler");

const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utls/apiError");

const categoryModel = require("../models/categoryModel");

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

exports.uploadCategoryImage = upload.single("image");

exports.resizeImage = asyncHandeller(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});
exports.getcaegories = factory.getAll(categoryModel);

exports.getCategory = factory.getOne(categoryModel);

exports.createCategory = factory.createOne(categoryModel);

exports.updateCategory = factory.updateOne(categoryModel);

exports.deleteCategory = factory.deleteOne(categoryModel);
