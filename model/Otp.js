const { default: mongoose } = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter Email Id."],
    unique: true,
    trim: true,
  },

  otp: {
    type: String,
    required: [true, "Please enter otp."],
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
