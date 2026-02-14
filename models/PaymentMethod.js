// models/PaymentMethod.js
import mongoose from "mongoose";
const paymentMethodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['UPI', 'BANK'],
    required: true,
  },
  upiName: String, 
  
  upiId: String,

  accountHolder: String,
  accountNumber: String,
  ifscCode: String,
  bankName: String,

  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const PaymentMethod= mongoose.model('PaymentMethod', paymentMethodSchema);
export default PaymentMethod;
