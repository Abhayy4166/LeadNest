const asyncHandler = require('express-async-handler'); // For simplifying async error handling
const User = require('../models/User'); // Bring in the User model
const generateToken = require('../utils/generateToken'); // For generating JWTs

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad request
    throw new Error('User already exists');
  }

  // Create new user
  const user = await User.create({
    name,
    email,
    password, // Password will be hashed by the pre-save hook in the User model
    role: role || 'Sales', // Default to 'Sales' if role is not provided
  });

  if (user) {
    res.status(201).json({ // 201 means 'Created'
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Generate JWT and send it back
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user by email
  const user = await User.findOne({ email });

  // If user exists and password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401); // Unauthorized
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile (example for a protected route)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // The 'req.user' object will be set by the 'protect' middleware (coming soon)
  const user = await User.findById(req.user._id).select('-password'); // Exclude password from response

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404); // Not Found
    throw new Error('User not found');
  }
});


module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};