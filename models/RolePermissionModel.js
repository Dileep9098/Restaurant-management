// models/RolePermission.js
import mongoose from "mongoose";

const rolePermissionSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true
  },
//   permissions: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Permission",
//     required: true
//   }
// permissions: [{ type: String }] ,

    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true }

}, { timestamps: true });

export default mongoose.model("RolePermission", rolePermissionSchema);
