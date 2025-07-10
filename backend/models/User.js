const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Will be used for password hashing

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email is unique across users
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'Sales'], // Restricts role to 'Admin' or 'Sales'
      default: 'Sales', // Default role for new users
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps automatically
  }
);

// --- Password Hashing Middleware ---
// This will run BEFORE saving the user if the password field is modified
userSchema.pre('save', async function (next) {
  // Only hash if the password field is new or has been modified
  if (!this.isModified('password')) {
    next(); // Move to the next middleware (or save operation)
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10); // 10 is a good default for salt rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method to compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;