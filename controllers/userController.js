const asyncHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");

const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const userModel = require("../models/userModel");
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

exports.uploadUserImage = upload.single("profileImage");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `USer-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImage = filename;
  }
  next();
});

exports.getUsers = factory.getAll(userModel);

exports.getaUser = factory.getOne(userModel);

exports.createUser = factory.createOne(userModel);
exports.updateUser = () =>
  asyncHandler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.email,
        profileImage: req.body.profileImage,
        role: req.body.role,
      },
      {
        new: true,
      }
    );

    if (!user) {
      return next(new ApiError(`no user fo this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: user });
  });
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
exports.deleteUser = factory.deleteOne(userModel);
