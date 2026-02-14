// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    lowercase: true
  },

  description: String,

  image: String,

  sortOrder: {
    type: Number,
    default: 0
  },

  isVeg: {
    type: Boolean,
    default: false
  },

  isNonVeg: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

// ✅ same restaurant me duplicate category name nahi
categorySchema.index({ restaurant: 1, name: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);
