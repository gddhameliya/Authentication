require("dotenv").config();
const express = require("express");
const app = express();
const users = require("./routes/users");
const product = require("./routes/productRoutes");
const db = require("./database/db");
require("express-async-errors");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(express.json());
app.use("/", users);
app.use(fileUpload({ useTempFiles: true }));
app.use(express.static("./public"));
app.use("/product/", product);

app.use(require("./middleware/errorHandler"));
// app.use((err, req, res, next) => {
//   console.log(err.code);
//   if (err) return res.status(400).send(err);
//   next();
// });

port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port} .....`));
