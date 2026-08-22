const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // GlobeTrotter extended user profile
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    // Computed virtual — kept for backward compat (other devs may use user.name)
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    additionalInformation: {
      type: String,
      trim: true,
      default: '',
    },
    // profilePhoto: store as base64 data URI for now (no external storage needed)
    // Can be swapped for a Cloudinary URL or S3 URL later without schema change
    profilePhoto: {
      type: String,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    // Virtual 'name' field so other developers' code referencing user.name still works
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: full name — backward compatible with existing code that uses user.name
userSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
