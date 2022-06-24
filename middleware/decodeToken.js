const jwt = require("jsonwebtoken");
const { model } = require("mongoose");

const decodeToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) return res.status(400).json({ message: "missing token.." });

  try {
    const { name, id: userId, email } = jwt.verify(token, "Random");
    req.user = { name, userId, email };
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token not verified.." });
  }
};

const verifiedToken = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) return res.status(400).json({ message: "missing token.." });

  try {
    const { email, verified } = jwt.verify(token, "Random");
    if (verified !== true)
      return res.status(400).json({ message: "Otp not verified.." });
    req.user = { email };
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { decodeToken, verifiedToken };
