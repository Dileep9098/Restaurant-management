import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true
  },

  variantGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VariantGroup",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  isDefault: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

// Compound unique index to prevent duplicates
variantSchema.index({ menuItem: 1, variantGroup: 1, name: 1 }, { unique: true });

export default mongoose.model("Variant", variantSchema);
