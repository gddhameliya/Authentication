const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter Product Name."],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    description: {
      type: String,
      required: [true, "Please enter Product Description."],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    image: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please enter Product Owner"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
