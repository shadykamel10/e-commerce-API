const mongooser = require("mongoose");

const cartSchema = new mongooser.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongooser.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type:Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongooser.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongooser.model("Cart", cartSchema);
