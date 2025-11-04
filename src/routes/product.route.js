const express = require("express");
const multer = require("multer");
const { authenticateToken } = require("../middlewares/auth.middleware");
const { productValidator } = require("../validators/product.validator");
const { handleValidationErrors } = require("../validators/validate");
const { createProduct } = require("../controllers/product.controller");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10, // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// POST /api/products - Create product
router.post(
  "/",
  authenticateToken,
  upload.array('images', 10), // Accept up to 10 image files
  productValidator,
  handleValidationErrors,
  createProduct
);

module.exports = router;
