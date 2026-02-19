import mongoose from "mongoose";

const inventorySettingSchema = new mongoose.Schema({

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  allowNegativeStock: {
    type: Boolean,
    default: false
  },

  autoDeductInventory: {
    type: Boolean,
    default: true
  },

  lowStockAlertEnabled: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("InventorySetting", inventorySettingSchema);