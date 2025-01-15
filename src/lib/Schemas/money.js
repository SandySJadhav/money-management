import mongoose from "mongoose";

const moneySchema = new mongoose.Schema({
  income: {
    type: Number,
    required: true
  },
  expenses: {
    type: Number,
    required: true
  },
  savings: {
    type: Number,
    required: true
  },
  lastUpdatedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
  }
});

const Money = mongoose.model('Money', moneySchema);

export default Money;