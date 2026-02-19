import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({

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

  ingredients: [
    {
      rawMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RawMaterial",
        required: true
      },
      quantityRequired: {
        type: Number,
        required: true
      }
    }
  ]

}, { timestamps: true });

export default mongoose.model("Recipe", recipeSchema);