import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema({

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  rawMaterial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
    required: true
  },

  type: {
    type: String,
    enum: ["IN", "OUT", "ADJUSTMENT", "WASTAGE"],
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },

  referenceModel: {
    type: String
  },

  note: String

}, { timestamps: true });

export default mongoose.model("InventoryTransaction", inventoryTransactionSchema);