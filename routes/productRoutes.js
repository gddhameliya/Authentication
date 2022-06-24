const express = require("express");
const router = express.Router();
const { decodeToken, verifiedToken } = require("../middleware/decodeToken");
const {
  createProduct,
  fetchProduct,
  updateProducts,
  deleteProduct,
} = require("../controller/productControl");

router.post("/createProduct", decodeToken, createProduct);
router.put("/updateProducts/:id", decodeToken, updateProducts);
router.get("/fetchProduct", fetchProduct);
router.delete("/deleteProduct/:id", decodeToken, deleteProduct);

module.exports = router;