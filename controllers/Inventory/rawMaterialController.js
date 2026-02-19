// import RawMaterial from "../models/RawMaterial.js";
// import RawMaterialCategory from "../models/RawMaterialCategory.js";
// import InventoryTransaction from "../models/InventoryTransaction.js";

import InventoryTransaction from "../../models/Inventory/InventoryTransaction.js";
import RawMaterial from "../../models/Inventory/RawMaterial.js";
import RawMaterialCategory from "../../models/Inventory/RawMaterialCategory.js";


// ✅ 1️⃣ CREATE RAW MATERIAL
export const createRawMaterial = async (req, res) => {
  try {
    const { name, category, unit, minStockLevel, storageType } = req.body;
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required"
      });
    }

    if (!name || !category || !unit) {
      return res.status(400).json({
        success: false,
        message: "Name, Category and Unit are required"
      });
    }

    // category check
    const categoryExists = await RawMaterialCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid category"
      });
    }

    // duplicate check within restaurant
    const existing = await RawMaterial.findOne({ name, restaurant: restaurantId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Raw material already exists"
      });
    }

    const material = await RawMaterial.create({
      restaurant: restaurantId,
      name,
      category,
      unit,
      minStockLevel,
      storageType
    });

    res.status(201).json({
      success: true,
      message: "Raw material created successfully",
      data: material
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 2️⃣ GET ALL RAW MATERIALS
export const getAllRawMaterials = async (req, res) => {
  try {
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ 
        success: false,
        message: "Restaurant ID is required" 
      });
    }

    const materials = await RawMaterial.find({ restaurant: restaurantId, isActive: true })
      .populate("category")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: materials.length,
      data: materials
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 3️⃣ GET SINGLE RAW MATERIAL
export const getRawMaterialById = async (req, res) => {
  try {

    const material = await RawMaterial.findById(req.params.id)
      .populate("category");

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found"
      });
    }

    res.status(200).json({
      success: true,
      data: material
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 4️⃣ UPDATE RAW MATERIAL
export const updateRawMaterial = async (req, res) => {
  try {

    const { name, category, unit, minStockLevel, storageType, isActive } = req.body;

    const material = await RawMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found"
      });
    }

    // duplicate check
    if (name && name !== material.name) {
      const existing = await RawMaterial.findOne({ name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Raw material name already exists"
        });
      }
    }

    material.name = name || material.name;
    material.category = category || material.category;
    material.unit = unit || material.unit;
    material.minStockLevel = minStockLevel ?? material.minStockLevel;
    material.storageType = storageType || material.storageType;

    if (typeof isActive !== "undefined") {
      material.isActive = isActive;
    }

    await material.save();

    res.status(200).json({
      success: true,
      message: "Raw material updated successfully",
      data: material
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 5️⃣ SOFT DELETE
export const deleteRawMaterial = async (req, res) => {
  try {

    const material = await RawMaterial.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: "Raw material not found"
      });
    }

    material.isActive = false;
    await material.save();

    res.status(200).json({
      success: true,
      message: "Raw material deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ 6️⃣ LOW STOCK API (Advanced 🔥)
export const getLowStockMaterials = async (req, res) => {
  try {

    const materials = await RawMaterial.find({ isActive: true });

    const lowStockItems = [];

    for (let material of materials) {

      const result = await InventoryTransaction.aggregate([
        { $match: { rawMaterial: material._id } },
        {
          $group: {
            _id: "$rawMaterial",
            totalIn: {
              $sum: {
                $cond: [{ $eq: ["$type", "IN"] }, "$quantity", 0]
              }
            },
            totalOut: {
              $sum: {
                $cond: [{ $in: ["$type", ["OUT", "WASTAGE", "ADJUSTMENT"]] }, "$quantity", 0]
              }
            }
          }
        }
      ]);

      const currentStock = result.length
        ? result[0].totalIn - result[0].totalOut
        : 0;

      if (currentStock <= material.minStockLevel) {
        lowStockItems.push({
          material,
          currentStock
        });
      }
    }

    res.status(200).json({
      success: true,
      data: lowStockItems
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};