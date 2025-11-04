const express = require('express');
const { register, login, logout } = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const { handleValidationErrors } = require('../validators/validate');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerValidation, handleValidationErrors, register);

// POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, login);

// POST /api/auth/logout
router.post('/logout', authenticateToken, logout);

module.exports = router;
