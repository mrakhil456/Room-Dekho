const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists(),
    body('role', 'Role must be specified').notEmpty().isIn(['tenant', 'landlord', 'admin']),
  ],
  authController.login
);

// Get current user
router.get('/me', auth, authController.getCurrentUser);

// Change password (authenticated users)
router.post(
  '/change-password',
  auth,
  [
    body('currentPassword', 'Current password is required').exists(),
    body('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
  ],
  authController.changePassword
);

// Change email (admin only)
router.post(
  '/change-email',
  auth,
  [
    body('newEmail', 'Please include a valid email').isEmail(),
  ],
  authController.changeEmail
);

module.exports = router;
