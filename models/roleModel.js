import mongoose from 'mongoose';
const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true,},
  isActive: { type: Boolean, default: true },
  // permissions: [{ type: String }] ,
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
}, { timestamps: true });

const Role = mongoose.model('Role', RoleSchema);
export default Role;
