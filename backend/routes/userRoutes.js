const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user profile
router.get('/profile/me', auth, userController.getUserProfile);

// Update user profile
router.put('/profile/me', auth, userController.updateUserProfile);
router.put('/preferences/theme', auth, userController.updateThemePreferences);

// Get user by ID
router.get('/:id', auth, userController.getUser);

// Admin routes - Get all users
router.get('/', auth, userController.getAllUsers);

// Admin routes - Delete user
router.delete('/:id', auth, userController.deleteUser);

// Admin routes - Update user role
router.put('/:id/role', auth, userController.updateUserRole);

module.exports = router;
