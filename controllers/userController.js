const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Helper: send validation errors
const sendValidationErrors = (res, errors) => {
  return res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
  });
};

// ─────────────────────────────────────────────
// @route   GET /api/user/getuser
// @desc    Get authenticated user's profile
// @access  Protected
// ─────────────────────────────────────────────
const getUser = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      user: {
        userId: user.userId,
        _id: user._id,
        username: user.username,
        email: user.email,
        year: user.year,
        Department: user.Department,
        Age: user.Age,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('GetUser Error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching user.' });
  }
};

// ─────────────────────────────────────────────
// @route   PATCH /api/user/updateuser
// @desc    Update authenticated user's profile
// @access  Protected
// ─────────────────────────────────────────────
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidationErrors(res, errors);

  try {
    const userId = req.user._id;

    // Whitelist of fields that can be updated
    const allowedFields = ['username', 'email', 'year', 'Department', 'Age', 'password'];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    // If updating email or username, check uniqueness
    if (updates.email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: userId } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email already in use by another account.' });
      }
    }
    if (updates.username) {
      const existing = await User.findOne({ username: updates.username, _id: { $ne: userId } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Username already taken.' });
      }
    }

    // If updating password, hash it
    if (updates.password) {
      if (updates.password.length < 6) {
        return res.status(422).json({ success: false, message: 'New password must be at least 6 characters.' });
      }
      const salt = await bcrypt.genSalt(12);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided to update.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      user: {
        userId: updatedUser.userId,
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        year: updatedUser.year,
        Department: updatedUser.Department,
        Age: updatedUser.Age,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    console.error('UpdateUser Error:', error);
    return res.status(500).json({ success: false, message: 'Server error updating user.' });
  }
};

module.exports = { getUser, updateUser };
