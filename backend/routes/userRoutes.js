const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/userController'); // Import functions from userController
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware (we'll create this next)

const router = express.Router(); // Create a new router instance

// Public Routes (no authentication needed)
router.post('/register', registerUser); // POST /api/users/register
router.post('/login', loginUser);       // POST /api/users/login

// Private Route (requires authentication)
// The 'protect' middleware will run first to verify the token
router.get('/profile', protect, getUserProfile); // GET /api/users/profile

module.exports = router;