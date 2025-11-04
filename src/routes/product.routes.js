const express = require('express');
const { getProducts, getProductById, updateProduct } = require('../controllers/product.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.patch('/:id', authenticateToken, updateProduct);

module.exports = router;
