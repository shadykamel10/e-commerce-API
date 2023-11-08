const express = require("express");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
} = require("../utls/validtors/userValidator");

const {
  getUsers,
  createUser,
  getaUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../controllers/userController");

const authentication = require("../controllers/authentication");

const router = express.Router();


router.patch(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(getUsers)
  .post(
    authentication.protect,
    authentication.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(
    authentication.protect,
    authentication.allowedTo("admin"),
    getUserValidator,
    getaUser
  )
  .patch(
    authentication.protect,
    authentication.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidator,
    updateUser
  )
  .delete(
    authentication.protect,
    authentication.allowedTo("admin"),
    deleteUserValidator,
    deleteUser
  );
module.exports = router;
