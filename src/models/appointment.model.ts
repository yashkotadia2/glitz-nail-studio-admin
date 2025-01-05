import mongoose, { Schema } from "mongoose";

// Define the Appointment Schema
const AppointmentSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
    validate: {
      validator: (v: number) => /^[0-9]{10}$/.test(v.toString()),
      message: "Phone number must be a 10-digit number",
    },
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  services: {
    type: [String], // Array of service IDs
    required: true,
  },
  message: {
    type: String,
    maxlength: 500, // Maximum length of message field
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create or get the Appointment model
const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
