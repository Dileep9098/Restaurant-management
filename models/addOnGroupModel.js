import mongoose from "mongoose";
const addOnGroupSchema = new mongoose.Schema({

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
    default:false
 },

 maxSelection:{
    type:Number,
    default:5
 },

 isActive:{
    type:Boolean,
    default:true
 }

},{timestamps:true});

export default mongoose.model("AddOnGroup",addOnGroupSchema);