import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    immutable: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  age: {
    type: Number,
    required: true,
    immutable: true
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  }
});

userSchema.pre('save',async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.lastUpdatedAt = Math.floor(Date.now() / 1000);
  next();
});

userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

userSchema.pre('updateOne', function(next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
 const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
 return token;
};

// Compare password
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;