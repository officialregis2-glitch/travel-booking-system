import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) throw new ApiError(404, 'User not found');
  res.json({ success: true, user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  let hasChanged = false;

  // Update username if provided and different
  if (username && username.toLowerCase() !== user.username) {
    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists) throw new ApiError(400, 'Username already taken');
    user.username = username.toLowerCase();
    hasChanged = true;
  }

  // Update password if new password is provided
  if (newPassword && newPassword.trim().length > 0) {
    if (!currentPassword || currentPassword.trim().length === 0) {
      throw new ApiError(400, 'Current password is required to set a new password');
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }
    
    // Validate new password length
    if (newPassword.length < 6) {
      throw new ApiError(400, 'New password must be at least 6 characters long');
    }
    
    // Set new password (will be hashed by pre-save hook)
    user.password = newPassword;
    hasChanged = true;
  }

  if (!hasChanged) {
    throw new ApiError(400, 'No changes to update');
  }

  await user.save();
  
  // Return updated user without password
  const updatedUser = await User.findById(user._id).select('-password');
  
  res.json({
    success: true,
    user: { 
      id: updatedUser._id, 
      username: updatedUser.username, 
      photo: updatedUser.photo, 
      role: updatedUser.role 
    },
    message: 'Profile updated successfully',
  });
});

export const uploadPhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.photo = photo;
  await user.save();

  res.json({
    success: true,
    user: { id: user._id, username: user.username, photo: user.photo, role: user.role },
    message: 'Photo updated successfully',
  });
});