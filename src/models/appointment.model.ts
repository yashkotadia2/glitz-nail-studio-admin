import mongoose, { Schema } from "mongoose";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// Define the Appointment Schema
const AppointmentSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String, // Since international numbers require '+' and country code, use String
    required: true,
    validate: {
      validator: function (v: string) {
        // Parse and validate the phone number using libphonenumber-js
        const phoneNumber = parsePhoneNumberFromString(v);
        return phoneNumber ? phoneNumber.isValid() : false;
      },
      message: "Invalid phone number",
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
