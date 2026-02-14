// // models/MenuItem.js
// import mongoose from "mongoose";

// const menuItemSchema = new mongoose.Schema({
//   restaurant: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Restaurant",
//     required: true,
//     index: true
//   },

//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Category",
//     required: true
//   },

//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   description: String,

//   image: String,

//   price: {
//     type: Number,
//     required: true
//   },

//   taxPercent: {
//     type: Number,
//     default: 0
//   },

//   finalPrice: {
//     type: Number
//   },

//   isVeg: {
//     type: Boolean,
//     default: false
//   },

//   isAvailable: {
//     type: Boolean,
//     default: true
//   },

//   availableFor: {
//     dineIn: { type: Boolean, default: true },
//     takeaway: { type: Boolean, default: true },
//     online: { type: Boolean, default: true }
//   },

//   sortOrder: {
//     type: Number,
//     default: 0
//   },

//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }

// }, { timestamps: true });

// export default mongoose.model("MenuItem", menuItemSchema);





import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
    index: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  description: String,
  image: [{type: String}],

  basePrice: {
    type: Number,
    default: 0
  },

  hasVariants: {
    type: Boolean,
    default: false
  },

  hasAddOns: {
    type: Boolean,
    default: false
  },

  tax: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tax"
  },

  isVeg: {
    type: Boolean,
    default: false
  },

  isAvailable: {
    type: Boolean,
    default: true
  },

  availableFor: {
    dineIn: { type: Boolean, default: true },
    takeaway: { type: Boolean, default: true },
    online: { type: Boolean, default: true }
  },

  sortOrder: {
    type: Number,
    default: 0
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

export default mongoose.model("MenuItem", menuItemSchema);
