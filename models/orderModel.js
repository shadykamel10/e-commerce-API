const mongooser = require("mongoose");

const orderSchema = new mongooser.Schema(
  {
    user: {
      type: mongooser.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user required"],
    },
    cartItems: [
      {
        product: {
          type: mongooser.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
        },
        color: String,
        price: Number,
      },
    ],
    taxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
    totalOrderPrice: Number,
    payMentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email",
  }).populate({
    path: "cartItems.product",
    select: "title imageCover", 
  });
  next();
});

module.exports = mongooser.model("Order", orderSchema);
