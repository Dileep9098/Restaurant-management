import mongoose from "mongoose";

const supplierItemSchema = new mongoose.Schema({
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
  rawMaterial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RawMaterial",
    required: true
  },
  lastPurchasePrice: Number
}, { timestamps: true });

export default mongoose.model("SupplierItem", supplierItemSchema);