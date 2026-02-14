// models/MenuItemAddOn.js
import mongoose from "mongoose";

const menuItemAddOnSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },

  addOn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AddOn",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("MenuItemAddOn", menuItemAddOnSchema);
