const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Helper: safe user payload — never expose password or sensitive internals
const safeUserPayload = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  name: user.name, // virtual
  email: user.email,
  phoneNumber: user.phoneNumber,
  city: user.city,
  country: user.country,
  additionalInformation: user.additionalInformation,
  profilePhoto: user.profilePhoto,
  role: user.role,
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      city,
      country,
      additionalInformation,
      profilePhoto,
      role,
    } = req.body;

    // Validate required fields
    if (!firstName || !firstName.trim()) {
      return res.status(400).json({ message: 'First name is required' });
    }
    if (!lastName || !lastName.trim()) {
      return res.status(400).json({ message: 'Last name is required' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });

    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password,
      phoneNumber: phoneNumber ? phoneNumber.trim() : '',
      city: city ? city.trim() : '',
      country: country ? country.trim() : '',
      additionalInformation: additionalInformation ? additionalInformation.trim() : '',
      profilePhoto: profilePhoto || '',
      role: role || 'user',
    });

    if (user) {
      res.status(201).json({
        ...safeUserPayload(user),
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // Don't expose stack traces
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        ...safeUserPayload(user),
        token: generateToken(user._id),
      });
    } else {
      // Generic message — don't reveal whether email exists
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Logout user (client-side token removal; route kept for future httpOnly cookie support)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  // JWT is stateless — client removes token. If cookies are adopted later, clear here.
  res.json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json(safeUserPayload(user));
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};
