import mongoose, { Schema } from "mongoose";

const flyerSchema: Schema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileKey: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Flyer = mongoose.models.Flyer || mongoose.model("Flyer", flyerSchema);

export default Flyer;
