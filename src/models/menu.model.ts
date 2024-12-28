import mongoose, { Schema } from "mongoose";

const MenuSchema: Schema = new mongoose.Schema({
  menuName: {
    type: String,
    required: true,
  },
  menuPrice: {
    type: Number,
    required: true,
  },
  menuCategory: {
    type: String,
    required: true,
  },
  menuDescription: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Menu = mongoose.models.Menu || mongoose.model("Menu", MenuSchema);

export default Menu;
