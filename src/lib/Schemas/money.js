import mongoose from "mongoose";

const moneyModel = new mongoose.Schema({
  startsAt: Date,
  endsAt: Date,
  createdAt: Date,
})

export const CalendarEvent = mongoose.model.Money || mongoose.model("Money", moneyModel)