const express = require('express');
const { addItemToCart, syncCart, getCart, updateCartItem } = require('../controllers/cart.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { addItemValidator, syncCartValidator, updateCartItemValidator } = require('../validators/cart.validator');
const { handleValidationErrors } = require('../validators/validate');

const router = express.Router();

// POST /api/cart/items - Add item to cart
router.post('/items', authenticateToken, addItemValidator, handleValidationErrors, addItemToCart);

// POST /api/cart/sync - Sync guest cart after login/register
router.post('/sync', authenticateToken, syncCartValidator, handleValidationErrors, syncCart);

// GET /api/cart - Get user's cart
router.get('/', authenticateToken, getCart);

// PATCH /api/cart/items/:productId - Update cart item quantity
router.patch('/items/:productId', authenticateToken, updateCartItemValidator, handleValidationErrors, updateCartItem);

module.exports = router;
