import mongoose from "mongoose";

const moneySchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
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

moneySchema.pre('save', function (next) {
  this.lastUpdatedAt = Math.floor(Date.now() / 1000);
  next();
});

moneySchema.pre('findOneAndUpdate', function (next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

moneySchema.pre('updateOne', function (next) {
  this.set({ lastUpdatedAt: Math.floor(Date.now() / 1000) });
  next();
});

const Money = mongoose.models.Money || mongoose.model('Money', moneySchema);

export default Money;