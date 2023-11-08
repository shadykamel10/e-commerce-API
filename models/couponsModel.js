const mongoose = require("mongoose");

const couponsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name required"],
    },
    discount: {
      type: Number,
      required: [true, "discount required"],
    },
    expire: {
      type: Date,
      required: [true, "expiry required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupons", couponsSchema);
