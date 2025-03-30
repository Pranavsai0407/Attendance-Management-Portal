// Example middleware for registration validation
const { body, validationResult } = require('express-validator');

// Middleware function for registration validation
const validateRegistration = [
  body('fullname').notEmpty().withMessage('Fullname is required'),
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  // You can add more validations as per your requirements
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegistration };
