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
  createdAt: {
    type: Number,
    default: () => Math.floor(Date.now() / 1000),
    immutable: true
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


accountSchema.pre('save', function(next) {
  this.lastUpdatedAt = Math.floor(Date.now() / 1000);
  next();
});

accountSchema.pre('findOneAndUpdate', function(next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

accountSchema.pre('updateOne', function(next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

const Account = mongoose.model('Account', accountSchema);

export default Account;