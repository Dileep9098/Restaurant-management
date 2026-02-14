// models/Tax.js
import mongoose from "mongoose";

const taxSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  name: {
    type: String,   // GST 5%, GST 12%
    required: true
  },

  percent: {
    type: Number,
    required: true
  },

  appliesTo: {
    type: String,
    enum: ["VEG", "NON_VEG", "ALL"],
    default: "ALL"
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Tax", taxSchema);
