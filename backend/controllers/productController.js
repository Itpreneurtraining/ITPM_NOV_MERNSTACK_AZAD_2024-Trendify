import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";




 const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestSeller,
    } = req.body;

    // console.log("Request Body: ", req.body);
    // console.log("Request Files: ", req.files);

    // Fetch images from req.files safely
    const productImages = [
      req.files.image1 && req.files.image1?.[0],
      req.files.image2 && req.files.image2?.[0],
      req.files.image3 && req.files.image3?.[0],
      req.files.image4 && req.files.image4?.[0],
    ].filter(Boolean);

    // Upload images to Cloudinary
    let imageUrls = await Promise.all(
      productImages.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true",
      image: imageUrls,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.log("Error while adding product: ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// // INFO: Route for fetching all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error while fetching all products: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for removing a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log("Error while removing product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// INFO: Route for fetching a single product
const getSingleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.log("Error while fetching single product: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {  addProduct,listProducts, removeProduct, getSingleProduct };
