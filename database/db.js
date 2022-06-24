const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/auth")
  .then(() => console.log("Connected ...."))
  .catch((e) => "Connection Failed !!!!");
