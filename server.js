const express = require("express");

const cors = require("cors");

const compression = require("compression");

const app = express();

app.use(cors());

app.options("*", cors());

app.use(compression());

const dotenv = require("dotenv");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
///////////////// routes
const mountRoute = require("./routes");
///////////////////////////////////////////
const ApiError = require("./utls/apiError");
const globelError = require("./middeleares/errorMiddelware");

mongoose
  .connect(
    "mongodb+srv://shadykamel19:node123@cluster0.hgmdsib.mongodb.net/e-commerce?retryWrites=true&w=majority"
  )
  .then((conn) => {
    console.log(`db coneccted :${conn.connection.host}`);
  })
  .catch((err) => {
    console.log(`dberror:${err}`);
  });
dotenv.config();
app.use(express.json()); // Middleware for parsing JSON
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}
/////////////////routes
mountRoute(app);
////////////////////////////
app.all("*", (req, res, next) => {
  next(new ApiError(`cant find this route${req.originalUrl}`, 400));
});
app.use(globelError);
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log("app run on port 8000");
});
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection at:", err);
  server.close(() => {
    process.exit(1);
  });
});
