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

accountGroupSchema.pre('save', function (next) {
  this.lastUpdatedAt = new Date()
  next();
});

accountGroupSchema.pre('findOneAndUpdate', function (next) {
  this.set({ lastUpdatedAt: new Date() });
  next();
});

accountGroupSchema.pre('updateOne', function (next) {
  this.set({ lastUpdatedAt: new Date() });
  next();
});

const AccountGroup = mongoose.models.AccountGroup || mongoose.model('AccountGroup', accountGroupSchema);

export default AccountGroup;