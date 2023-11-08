const express = require("express");
const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utls/validtors/reviewValidator  ");

const {
  getreviews,
  createreview,
  getareview,
  updatereview,
  deletereview,
  createFilterObj,
} = require("../controllers/reviewController");
const authentication = require("../controllers/authentication");
// merge params makes you catch thad id
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getreviews)
  .post(
    createReviewValidator,
    authentication.protect,
    authentication.allowedTo("user"),
    createreview
  );
router
  .route("/:id")
  .get(getReviewValidator, getareview)
  .patch(
    authentication.protect,
    authentication.allowedTo("user"),
    updateReviewValidator,
    updatereview
  )
  .delete(
    authentication.protect,
    authentication.allowedTo("user", "manger", "admin"),
    deleteReviewValidator,
    deletereview
  );
module.exports = router;
