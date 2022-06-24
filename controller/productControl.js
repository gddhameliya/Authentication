const { StatusCodes } = require("http-status-codes");
const Product = require("../model/Product");
// const deleteImage = require("../utils/delete-image");
// const cloudinary = require("cloudinary").v2;
// const uploadImage = require("../utils/upload-image");

module.exports = {
  createProduct: async (req, res) => {
    const { name, description } = req.body;
    const { userId } = req.user;
    if (!name?.trim() || !description?.trim())
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All fields are require." });

    // if (!req.files)
    //   return res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json({ message: "No Image Uploaded." });

    const productInDB = await Product.findOne({ name });
    if (productInDB)
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Product already Exist.",
      });

    // const imgUploadResult = await uploadImage(req.files.image, res);
    let product = await Product.create({
      name,
      description,
      createdBy: userId,
      //   image: imgUploadResult.secure_url,
    });
    product = await product.populate("createdBy");
    product.createdBy.password = undefined;
    res.status(StatusCodes.CREATED).json({ product });
  },
  updateProducts: async (req, res) => {
    const { name, description } = req.body;
    const productId = req.params.id;
    const { userId } = req.user;

    if (!name?.trim() || !description?.trim())
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "All Fields are Require." });

    // if (!req.files)
    //   return res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json({ message: "No Image Uploaded." });

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Product not Found." });

    if (product.createdBy.toString() !== userId)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized access." });

    // deleteImage(product.image);
    // const imgUploadResult = await uploadImage(req.files?.image, res);

    let updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        description,
        // image: imgUploadResult.secure_url,
      },
      { new: true }
    );

    updatedProduct = await updatedProduct.populate("createdBy");
    updatedProduct.createdBy.password = undefined;

    res.status(StatusCodes.OK).json({ updatedProduct });
  },
  fetchProduct: async (req, res) => {
    const { userId } = req.query;
    const { productId } = req.query;

    if (userId && productId) {
      const product = await Product.findOne({
        _id: productId,
        userID: userId,
      }).populate("createdBy");

      if (!product)
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: "Product not Found.",
        });
      product.createdBy.password = undefined;
      return res.status(StatusCodes.OK).json({ product });
    }

    if (productId) {
      const product = await Product.findById(productId).populate("createdBy");
      if (!product)
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Product not Found." });

      product.createdBy.password = undefined;
      res.status(StatusCodes.OK).json({ product });
    } else {
      let products = [];
      if (userId)
        try {
          products = await Product.find({ createdBy: userId })
            .populate("createdBy")
            .sort("-createdAt -updatedAt");
        } catch (err) {}
      else
        products = await Product.find({})
          .populate("createdBy")
          .sort("-createdAt -updatedAt");
      products.forEach((prod) => (prod.createdBy.password = undefined));
      res.status(StatusCodes.OK).json({ products, count: products.length });
    }
  },
  deleteProduct: async (req, res) => {
    const productId = req.params.id;
    const { userId } = req.user;
    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Product not found." });
    if (product.createdBy.toString() !== userId)
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized access." });

    // deleteImage(product.image);
    await product.remove();
    res.status(StatusCodes.OK).json({ message: "Product deleted." });
  },
};
