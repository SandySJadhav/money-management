import mongoose from "mongoose";

const accountGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
    immutable: true
  },
  lastUpdatedAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000)
  },
});

accountGroupSchema.pre('save', function(next) {
  this.lastUpdatedAt = Math.floor(Date.now() / 1000);
  next();
});

accountGroupSchema.pre('findOneAndUpdate', function(next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

accountGroupSchema.pre('updateOne', function(next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

const AccountGroup = mongoose.model('AccountGroup', accountGroupSchema);

export default AccountGroup;