import mongoose from "mongoose";
const variantGroupSchema = new mongoose.Schema({

  restaurant:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Restaurant",
    required:true
  },

  menuItem:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"MenuItem",
    required:true
  },

  name:{
    type:String,
    required:true
  },

  isRequired:{
    type:Boolean,
    default:true
  },

  isMultiple:{
    type:Boolean,
    default:false
  },

  isActive:{
    type:Boolean,
    default:true
  }

},{timestamps:true});

export default mongoose.model("VariantGroup",variantGroupSchema);