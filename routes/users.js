const express = require("express");
const router = express.Router();
const { decodeToken, verifiedToken } = require("../middleware/decodeToken");
const {
  registerUser,
  loginUser,
  resetPassword,
  forgot,
  verifyOtp,
  changePassword,
} = require("../controller/userControl");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/resetPassword", decodeToken, resetPassword);

router.post("/forgot", forgot);

// router.post("/verifyOtp", async (req, res) => {

//   const { email, otp, newPassword } = req.body;

//   if (!email || !otp || !newPassword)
//     return res.status(400).send("All field required...");

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ message: "User not Found..." });

//   if (otp === user.otp) {
//     user.password = newPassword;
//   }

//   await user.save();
//   res.status().json({ message: "Password changed...." });
// });

router.post("/verifyOtp", verifyOtp);

router.post("/changePassword", changePassword);

module.exports = router;
