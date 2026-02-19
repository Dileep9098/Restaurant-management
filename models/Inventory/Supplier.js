import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: String,
  email: String,
  address: String,
  gstNumber: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);