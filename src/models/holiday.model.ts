import mongoose, { Schema } from "mongoose";

const HolidaySchema: Schema = new mongoose.Schema({
  holidayName: {
    type: String,
    required: true,
  },
  holidayDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Holiday =
  mongoose.models.Holiday || mongoose.model("Holiday", HolidaySchema);

export default Holiday;
