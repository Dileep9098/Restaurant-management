// models/Combo.js
import mongoose from "mongoose";

const comboSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem"
    },
    quantity: {
      type: Number,
      default: 1
    }
  }],

  comboPrice: {
    type: Number,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Combo", comboSchema);
