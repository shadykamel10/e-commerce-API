const cattegoryRoute = require("./categoryRoute");
const subcattegoryRoute = require("./subCategoryRoute");
const brandyRoute = require("./brandRoute ");
const productRoute = require("./productRoute ");
const usertRoute = require("./userRoute  ");
const authRoute = require("./authRoute   ");
const reviewsRoute = require("./reviewsRoute");
const wishListRoute = require("./wishListRoute");
const addressesRoute = require("./addressesRoute");
const couponsRoute = require("./couponsRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

const mountRoute = (app) => {
  app.use("/api/v1/categories", cattegoryRoute);
  app.use("/api/v1/subcategories", subcattegoryRoute);
  app.use("/api/v1/brands", brandyRoute);
  app.use("/api/v1/product", productRoute);
  app.use("/api/v1/users", usertRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewsRoute);
  app.use("/api/v1/wishList", wishListRoute);
  app.use("/api/v1/addresses", addressesRoute);
  app.use("/api/v1/coupons", couponsRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/orders", orderRoute);
};

module.exports = mountRoute;
