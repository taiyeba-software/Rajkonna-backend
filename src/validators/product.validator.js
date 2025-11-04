const { body } = require('express-validator');

const productValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),

  body('images')
    .isArray({ min: 1 })
    .withMessage('Images must be an array with at least one item'),

  body('images.*.url')
    .isString()
    .notEmpty()
    .withMessage('Each image must have a valid URL'),

  body('images.*.filename')
    .isString()
    .notEmpty()
    .withMessage('Each image must have a filename'),
];

module.exports = {
  productValidator,
};
