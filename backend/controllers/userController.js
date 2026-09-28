const User = require('../models/User');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, bio, profileImage } = req.body;

    let user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, bio, profileImage },
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Update persisted UI theme preferences
exports.updateThemePreferences = async (req, res) => {
  try {
    const { themeMode, themeAccent } = req.body;
    if (!['light', 'dark'].includes(themeMode)) {
      return res.status(400).json({ message: 'Invalid theme mode' });
    }
    if (!['amber', 'indigo', 'emerald', 'rose'].includes(themeAccent)) {
      return res.status(400).json({ message: 'Invalid theme accent' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'preferences.themeMode': themeMode, 'preferences.themeAccent': themeAccent } },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      const requester = await User.findById(req.user.id).select('role');
      if (!requester || requester.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Admin - Get all users
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Admin - Delete user
exports.deleteUser = async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};

// Admin - Update user role
exports.updateUserRole = async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { role } = req.body;
    if (!['tenant', 'landlord', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'An unexpected error occurred' });
  }
};
