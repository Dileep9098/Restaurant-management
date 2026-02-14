import Variant from "../models/varianModel.js";
import VariantGroup from "../models/VariantGroupModel.js";
import MenuItem from "../models/menuItemModel.js";

export const createVariantGroup = async (req,res)=>{
  try{

    const {restaurant, menuItem, name, isRequired, isMultiple} = req.body;

    if(!restaurant || !menuItem || !name){
      return res.status(400).json({
        success:false,
        message:"restaurant, menuItem and name are required"
      });
    }

    const item = await MenuItem.findById(menuItem);
    if(!item){
      return res.status(404).json({
        success:false,
        message:"Menu item not found"
      });
    }

    // ✅ prevent duplicate
    const exists = await VariantGroup.findOne({
      restaurant,
      menuItem,
      name
    });

    if(exists){
      return res.status(400).json({
        success:false,
        message:"Variant group already exists for this item"
      });
    }

    const group = await VariantGroup.create({
      restaurant,
      menuItem,
      name,
      isRequired,
      isMultiple
    });

    res.status(201).json({
      success:true,
      message:"Variant group created",
      data:group
    });

  }catch(err){

    // duplicate error catch (IMPORTANT)
    if(err.code === 11000){
      return res.status(400).json({
        success:false,
        message:"Duplicate variant group"
      });
    }

    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};


export const updateVariantGroup = async (req,res)=>{
  try{

    const {id} = req.params;

    const group = await VariantGroup.findById(id);

    if(!group){
      return res.status(404).json({
        success:false,
        message:"Variant group not found"
      });
    }

    Object.assign(group, req.body);

    await group.save();

    res.json({
      success:true,
      message:"Variant group updated",
      data:group
    });

  }catch(err){

    if(err.code === 11000){
      return res.status(400).json({
        success:false,
        message:"Duplicate group name"
      });
    }

    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};

export const deleteVariantGroup = async (req,res)=>{
  try{

    const {id} = req.params;

    const group = await VariantGroup.findByIdAndUpdate(
      id,
      {isActive:false},
      {new:true}
    );

    if(!group){
      return res.status(404).json({
        success:false,
        message:"Variant group not found"
      });
    }

    res.json({
      success:true,
      message:"Variant group deleted"
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};


export const getVariantGroupsByItem = async (req,res)=>{
  try{

    const {id} = req.params;
    console.log("Id kya hai ",req.params)

    const groups = await VariantGroup.find({
      menuItem:id,
      isActive:true
    }).sort({createdAt:1});

    res.json({
      success:true,
      count:groups.length,
      data:groups
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};


export const getSingleVariantGroup = async (req,res)=>{
  try{

    const group = await VariantGroup.findById(req.params.id);

    if(!group){
      return res.status(404).json({
        success:false,
        message:"Not found"
      });
    }

    res.json({
      success:true,
      data:group
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};



//  Variants Controller


export const createVariant = async (req,res)=>{
  try{

    const {
      restaurant,
      menuItem,
      variantGroup,
      name,
      price,
      isDefault
    } = req.body;

    if(!restaurant || !menuItem || !variantGroup || !name){
      return res.status(400).json({
        success:false,
        message:"Required fields missing"
      });
    }

    if(price < 0){
      return res.status(400).json({
        success:false,
        message:"Price cannot be negative"
      });
    }

    // ✅ group exists?
    const group = await VariantGroup.findById(variantGroup);
    if(!group){
      return res.status(404).json({
        success:false,
        message:"Variant group not found"
      });
    }

    // ✅ prevent duplicate
    const exists = await Variant.findOne({
      menuItem,
      variantGroup,
      name
    });

    if(exists){
      return res.status(400).json({
        success:false,
        message:"Variant already exists"
      });
    }

    // ✅ handle default
    if(isDefault){
      await Variant.updateMany(
        { variantGroup },
        { isDefault:false }
      );
    }

    const variant = await Variant.create({
      restaurant,
      menuItem,
      variantGroup,
      name,
      price,
      isDefault
    });

    res.status(201).json({
      success:true,
      message:"Variant created",
      data:variant
    });

  }catch(err){

    if(err.code === 11000){
      return res.status(400).json({
        success:false,
        message:"Duplicate variant"
      });
    }

    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};

export const getVariantsByGroup = async (req,res)=>{
  try{

    const {groupId} = req.params;

    const variants = await Variant.find({
      variantGroup:groupId,
      isActive:true
    }).sort({price:1});

    res.json({
      success:true,
      count:variants.length,
      data:variants
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};


export const updateVariant = async (req,res)=>{
  try{

    const {id} = req.params;

    const variant = await Variant.findById(id);

    if(!variant){
      return res.status(404).json({
        success:false,
        message:"Variant not found"
      });
    }

    // ✅ if setting default → remove others
    if(req.body.isDefault){
      await Variant.updateMany(
        { variantGroup: variant.variantGroup },
        { isDefault:false }
      );
    }

    Object.assign(variant, req.body);

    await variant.save();

    res.json({
      success:true,
      message:"Variant updated",
      data:variant
    });

  }catch(err){

    if(err.code === 11000){
      return res.status(400).json({
        success:false,
        message:"Duplicate variant name"
      });
    }

    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};

export const deleteVariant = async (req,res)=>{
  try{

    const {id} = req.params;

    const variant = await Variant.findByIdAndUpdate(
      id,
      {isActive:false},
      {new:true}
    );

    if(!variant){
      return res.status(404).json({
        success:false,
        message:"Variant not found"
      });
    }

    res.json({
      success:true,
      message:"Variant deleted"
    });

  }catch(err){
    res.status(500).json({
      success:false,
      message:err.message
    });
  }
};
export const getSingleVariant = async (req,res)=>{
  try{
    const variant = await Variant.findById(req.params.id);

    if(!variant){   
        return res.status(404).json({   
        success:false,
        message:"Variant not found"   
      });   
    }   
    res.json({
        success:true,   
        data:variant   
      });
    }catch(err){
        res.status(500).json({
        success:false,
        message:err.message
      });
    }
};
