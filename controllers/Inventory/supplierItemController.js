import SupplierItem from "../../models/Inventory/SupplierItem.js";


export const createSupplierItem = async (req, res) => {
  try {
    const { supplier, rawMaterial, lastPurchasePrice, isActive } = req.body;
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const existing = await SupplierItem.findOne({ supplier, rawMaterial, restaurant: restaurantId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This item already linked with supplier"
      });
    }

    const supplierItem = await SupplierItem.create({
      restaurant: restaurantId,
      supplier,
      rawMaterial,
      lastPurchasePrice,
      isActive: isActive !== undefined ? isActive : true
    });

    // Populate the response with supplier and rawMaterial details
    await supplierItem.populate("supplier", "name phone");
    await supplierItem.populate("rawMaterial", "name unit averageCost");

    res.status(201).json({ success: true, data: supplierItem });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getItemsBySupplier = async (req, res) => {
  try {
    const items = await SupplierItem.find({
      supplier: req.params.supplierId
    }).populate("rawMaterial");

    res.status(200).json({ success: true, data: items });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const getAllSupplierItems = async (req, res) => {
  try {
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    
    const items = await SupplierItem.find({ restaurant: restaurantId })
      .populate("supplier", "name phone")
      .populate("rawMaterial", "name unit averageCost");

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSupplierItemById = async (req, res) => {
  try {
    const item = await SupplierItem.findById(req.params.id)
      .populate("supplier")
      .populate("rawMaterial");

    if (!item || !item.isActive) {
      return res.status(404).json({
        success: false,
        message: "Supplier item not found"
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const updateSupplierItem = async (req, res) => {
  try {
    const { lastPurchasePrice, isActive } = req.body;

    console.log("Updating supplier item:", req.params.id, req.body);

    const item = await SupplierItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Supplier item not found"
      });
    }

    // Update all provided fields
    if (lastPurchasePrice !== undefined) {
      item.lastPurchasePrice = lastPurchasePrice;
    }
    
    if (isActive !== undefined) {
      item.isActive = isActive;
    }

    await item.save();

    // Populate the response with supplier and rawMaterial details
    await item.populate("supplier", "name phone");
    await item.populate("rawMaterial", "name unit averageCost");

    res.status(200).json({
      success: true,
      message: "Supplier item updated successfully",
      data: item
    });

  } catch (error) {
    console.error("Error updating supplier item:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteSupplierItem = async (req, res) => {
  try {
    const item = await SupplierItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Supplier item not found"
      });
    }

    // Soft delete - set isActive to false
    item.isActive = false;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Supplier item deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting supplier item:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const reactivateSupplierItem = async (req, res) => {
  try {
    const item = await SupplierItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Supplier item not found"
      });
    }

    item.isActive = true;
    await item.save();

    res.status(200).json({
      success: true,
      message: "Supplier item reactivated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSuppliersByRawMaterial = async (req, res) => {
  try {
    const items = await SupplierItem.find({
      rawMaterial: req.params.rawMaterialId,
      isActive: true
    }).populate("supplier");

    res.status(200).json({
      success: true,
      data: items
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
