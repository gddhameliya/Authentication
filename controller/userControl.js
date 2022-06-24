const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const { User, validateUser } = require("../model/user");
const jwt = require("jsonwebtoken");
const sendMail = require("../service/sendMail");
const Otp = require("../model/Otp");

module.exports = {
  registerUser: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(StatusCodes.BAD_REQUEST).send("All fields required...");

    const { error } = validateUser(req.body);
    if (error)
      return res.status(StatusCodes.BAD_REQUEST).send(error.details[0].message);

    const oldUser = await User.findOne({ email });
    if (oldUser)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send("Email already register..");

    let user = await User.create({
      name: name,
      email: email,
      password: password,
    });

    const token = jwt.sign({ id: user._id, name, email }, "Random", {
      expiresIn: "1h",
    });

    user.token = token;
    res
      .status(StatusCodes.OK)
      .json({ id: user._id, name: user.name, email: user.email });
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(StatusCodes.BAD_REQUEST).send("All fields required...");

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email id not Found..." });

    const date = new Date().toLocaleString().split(",")[0];

    const validPassword = await bcrypt.compare(password, user.password);

    let token;

    if (user && validPassword) {
      token = jwt.sign(
        { id: user._id, name: user.name, email, date },
        "Random",
        {
          expiresIn: "1h",
        }
      );
      return res.status(StatusCodes.OK).json({
        id: User._id,
        name: user.name,
        email: user.email,
        date,
        token,
      });
    }
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "Invalid Credentials." });
  },

  resetPassword: async (req, res) => {
    const { userId } = req.user;
    const user = await User.findById(userId);

    if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not found..." });

    const { password, newPassword } = req.body;
    if (!password || !newPassword)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Provide currant and new Password..." });

    if (password === newPassword)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Both Password are same..." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Currant password not match..." });

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ message: "Password changed...." });
  },

  forgot: async (req, res) => {
    const { email } = req.body;
    if (!email)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "You must have enter register email ID:" });

    const user = await User.findOne({ email });
    if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found..." });

    const generateOtp = Math.floor(100000 + Math.random() * 900000).toString();

    sendMail(email, `${generateOtp}`);

    const fetchOtp = await Otp.findOne({ email: user.email });
    if (!fetchOtp) await Otp.create({ email: user.email, otp: generateOtp });
    else {
      (fetchOtp.otp = generateOtp), fetchOtp.save();
    }

    // user.otp = `${generateOtp}`;
    // await user.save();
    res.status(StatusCodes.BAD_REQUEST).json({ message: "Otp has been send..." });
  },

  verifyOtp: async (req, res) => {
    const { email, otp: userOtp } = req.body;

    if (!email || !userOtp)
      return res.status(StatusCodes.BAD_REQUEST).send("All field required...");

    const userVerified = await Otp.findOne({ email });
    if (!userVerified)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found..." });
    // const user = await User.findOne({ email });
    // if (!user) return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found..." });

    if (userOtp !== userVerified.otp) {
      return res.status(StatusCodes.BAD_REQUEST).send("Invalid OTP....");
    }

    userVerified.isVerified = true;
    // const token = jwt.sign({ email, verified: true }, "Random", {
    //   expiresIn: 300,
    // });

    userVerified.save();
    res.status(StatusCodes.OK).json({ message: "Otp verified..." });
  },

  changePassword: async (req, res) => {
    // const { email } = req.user;
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(StatusCodes.BAD_REQUEST).send("All field required...");

    const user = await User.findOne({ email });
    const userVerified = await Otp.findOne({ email });
    if (!user || !userVerified)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found..." });

    // if (!newPassword)
    //   return res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json({ message: "New Password should not be empty..." });

    user.password = newPassword;
    await user.save();
    await userVerified.remove();

    res.status(StatusCodes.OK).json({ message: "Password has been changed..." });
  },
};
