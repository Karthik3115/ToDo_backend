const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    year: {
      type: Number,
      min: [1, 'Year must be at least 1'],
      max: [5, 'Year cannot exceed 5'],
    },
    Department: {
      type: String,
      trim: true,
    },
    Age: {
      type: Number,
      min: [1, 'Age must be positive'],
      max: [120, 'Age seems invalid'],
    },
  },
  {
    timestamps: true, // auto createdAt & updatedAt
  }
);

module.exports = model('User', userSchema);
