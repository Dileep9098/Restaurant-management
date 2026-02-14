// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, required: true },

  email: String,

  loyaltyPoints: { type: Number, default: 0 },

  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
