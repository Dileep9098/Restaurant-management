// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   PhoneNumber: {
//     type: String,
//   },
//   password: {
//     type: String,
//     select: true
//   },
//   role: {
//     type: String,
//     default: "user"
//   },
//   IsActive: {
//     type: Boolean,
//     default: true
//   },


// }
// , {
//   timestamps: true
// });

// const User = mongoose.model("User", userSchema);

// export default User;


import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  phone: String,
  city: {
    type: String,
  },


  password: {
    type: String,
    required: true,
    select: true
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  stateName: {
    type: String,
  },
  address: {
    type: String,
  },
  pincode: {
    type: Number,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    // required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  lastLogin: Date,

  otp: String,
  otpExpires: Date,

  // ✅ Required for forgot password flow
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Generate reset password token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

  return resetToken;
};

// Add this to your userSchema
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model("User", userSchema);
export default User;
