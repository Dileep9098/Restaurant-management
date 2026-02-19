import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true
  },

  items: [
    {
      rawMaterial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RawMaterial",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      pricePerUnit: {
        type: Number,
        required: true
      },
      total: Number
    }
  ],

  totalAmount: {
    type: Number,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);