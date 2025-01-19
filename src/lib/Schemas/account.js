import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  accountGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AccountGroup',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
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


accountSchema.pre('save', function (next) {
  this.lastUpdatedAt = new Date();
  next();
});

accountSchema.pre('findOneAndUpdate', function (next) {
  this.set({ lastUpdatedAt: new Date() });
  next();
});

accountSchema.pre('updateOne', function (next) {
  this.set({ lastUpdatedAt: new Date() });
  next();
});

const Account = mongoose.models.Account || mongoose.model('Account', accountSchema);

export default Account;