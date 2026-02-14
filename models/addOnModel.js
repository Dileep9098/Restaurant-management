// models/AddOn.js
import mongoose from "mongoose";
const addOnSchema = new mongoose.Schema({

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

 addOnGroup:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"AddOnGroup",
    required:true
 },

 name:{
    type:String,
    required:true
 },

 price:{
    type:Number,
    default:0
 },

 isVeg:{
    type:Boolean,
    default:true
 },

 isActive:{
    type:Boolean,
    default:true
 }

},{timestamps:true});


export default mongoose.model("AddOn", addOnSchema);
