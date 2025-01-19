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

moneySchema.pre('save', function (next) {
  this.lastUpdatedAt = new Date();
  next();
});

moneySchema.pre('findOneAndUpdate', function (next) {
  this.set({ lastUpdatedAt: new Date() });
  next();
});

moneySchema.pre('updateOne', function (next) {
  this.set({ lastUpdatedAt: new Date() });
  next();
});

const Money = mongoose.models.Money || mongoose.model('Money', moneySchema);

export default Money;