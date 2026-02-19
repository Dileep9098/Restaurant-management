import InventoryTransaction from "../../models/Inventory/InventoryTransaction.js";
import RawMaterial from "../../models/Inventory/RawMaterial.js";

// Get All Inventory Transactions
export const getAllInventoryTransactions = async (req, res) => {
  try {
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ 
        success: false, 
        message: "Restaurant ID is required" 
      });
    }

    const transactions = await InventoryTransaction.find({ restaurant: restaurantId })
      .populate("rawMaterial", "name unit averageCost")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });

  } catch (error) {
    console.error("Error fetching inventory transactions:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Create Inventory Transaction
export const createInventoryTransaction = async (req, res) => {
  try {
    const { rawMaterial, type, quantity, referenceId, referenceModel, notes } = req.body;
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ 
        success: false, 
        message: "Restaurant ID is required" 
      });
    }

    if (!rawMaterial || !type || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: "Raw material, type, and quantity are required" 
      });
    }

    // Validate transaction type
    const validTypes = ["IN", "OUT", "ADJUSTMENT", "WASTAGE"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid transaction type" 
      });
    }

    // Check if raw material exists
    const material = await RawMaterial.findOne({ 
      _id: rawMaterial, 
      restaurant: restaurantId 
    });

    if (!material) {
      return res.status(404).json({ 
        success: false, 
        message: "Raw material not found" 
      });
    }

    // Create transaction
    const transaction = await InventoryTransaction.create({
      restaurant: restaurantId,
      rawMaterial,
      type,
      quantity,
      referenceId: referenceId || undefined,
      referenceModel: referenceModel || undefined,
      notes: notes || undefined
    });

    // Populate response
    await transaction.populate("rawMaterial", "name unit averageCost");

    res.status(201).json({
      success: true,
      message: "Inventory transaction created successfully",
      data: transaction
    });

  } catch (error) {
    console.error("Error creating inventory transaction:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get Current Stock of Raw Material
export const getCurrentStock = async (req, res) => {
  try {
    const { rawMaterialId } = req.params;
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ 
        success: false, 
        message: "Restaurant ID is required" 
      });
    }

    const transactions = await InventoryTransaction.find({
      rawMaterial: rawMaterialId,
      restaurant: restaurantId
    });

    let stock = 0;

    transactions.forEach(t => {
      if (t.type === "IN") stock += t.quantity;
      if (t.type === "OUT" || t.type === "WASTAGE") stock -= t.quantity;
      if (t.type === "ADJUSTMENT") stock += t.quantity;
    });

    res.status(200).json({
      success: true,
      data: { stock }
    });

  } catch (error) {
    console.error("Error getting current stock:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Add Manual Stock Adjustment
export const addStockAdjustment = async (req, res) => {
  try {
    const { rawMaterial, quantity, note } = req.body;
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ 
        success: false, 
        message: "Restaurant ID is required" 
      });
    }

    // Check if raw material exists
    const material = await RawMaterial.findOne({ 
      _id: rawMaterial, 
      restaurant: restaurantId 
    });

    if (!material) {
      return res.status(404).json({ 
        success: false, 
        message: "Raw material not found" 
      });
    }

    const transaction = await InventoryTransaction.create({
      restaurant: restaurantId,
      rawMaterial,
      type: "ADJUSTMENT",
      quantity,
      note
    });

    // Populate response
    await transaction.populate("rawMaterial", "name unit averageCost");

    res.status(201).json({
      success: true,
      message: "Stock adjustment created successfully",
      data: transaction
    });

  } catch (error) {
    console.error("Error adding stock adjustment:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};