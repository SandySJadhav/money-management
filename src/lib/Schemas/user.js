import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
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

userSchema.pre('save', function(next) {
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

const User = mongoose.model('User', userSchema);

export default User;