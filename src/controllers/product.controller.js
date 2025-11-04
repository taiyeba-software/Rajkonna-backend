const Product = require('../models/product.model');
const { uploadImage } = require('../services/imagekit.service');

const createProduct = async (req, res) => {
  try {
    // Check user role
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'seller')) {
      return res.status(403).json({ message: 'Access denied. Only admin or seller can create products.' });
    }

    const { name, price, stock, category } = req.body;

    // Upload images to ImageKit
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageData = await uploadImage(file);
        uploadedImages.push(imageData);
      }
    }

    // Create product
    const product = new Product({
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: uploadedImages,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
};
