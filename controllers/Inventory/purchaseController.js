import mongoose from "mongoose";

import Purchase from "../../models/Inventory/Purchase.js";
import SupplierItem from "../../models/Inventory/SupplierItem.js";
import RawMaterial from "../../models/Inventory/RawMaterial.js";
import InventoryTransaction from "../../models/Inventory/InventoryTransaction.js";

export const createPurchase = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const { supplier, items, isActive } = req.body;
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      throw new Error("Restaurant ID is required");
    }
    
    if (!supplier || !items?.length) {
      throw new Error("Invalid purchase data");
    }

    let totalAmount = 0;

    // calculate totals
    for (let item of items) {
      item.total = item.quantity * item.pricePerUnit;
      totalAmount += item.total;
    }

    const purchase = await Purchase.create([{
      restaurant: restaurantId,
      supplier,
      items,
      totalAmount,
      isActive: isActive !== undefined ? isActive : true
    }], { session });

    // STOCK IN + UPDATE AVG COST
    for (let item of items) {

      // 1️⃣ Inventory Transaction
      await InventoryTransaction.create([{
        restaurant: restaurantId,
        rawMaterial: item.rawMaterial,
        type: "IN",
        quantity: item.quantity,
        referenceId: purchase[0]._id,
        referenceModel: "Purchase"
      }], { session });

      // 2️⃣ Update SupplierItem last price
      await SupplierItem.findOneAndUpdate(
        { restaurant: restaurantId, supplier, rawMaterial: item.rawMaterial },
        { lastPurchasePrice: item.pricePerUnit },
        { upsert: true, new: true, session }
      );

      // 3️⃣ Update Average Cost (Weighted)
      const material = await RawMaterial.findById(item.rawMaterial).session(session);

      const totalStock = await InventoryTransaction.aggregate([
        { $match: { rawMaterial: material._id, restaurant: restaurantId, type: "IN" } },
        {
          $group: {
            _id: "$rawMaterial",
            totalQty: { $sum: "$quantity" }
          }
        }
      ]).session(session);

      const oldQty = totalStock.length ? totalStock[0].totalQty : 0;

      const newAvg =
        ((material.averageCost * (oldQty - item.quantity)) +
          (item.quantity * item.pricePerUnit)) / oldQty;

      material.averageCost = newAvg;
      await material.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // Populate created purchase for frontend
    await purchase[0].populate("supplier", "name phone");
    await purchase[0].populate({
      path: "items.rawMaterial",
      select: "name unit averageCost"
    });

    res.status(201).json({
      success: true,
      message: "Purchase created successfully",
      data: purchase[0]
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    console.error("Error creating purchase:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};


export const getAllPurchases = async (req, res) => {
  try {
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    
    const purchases = await Purchase.find({ restaurant: restaurantId, isActive: true })
      .populate("supplier", "name phone")
      .populate({
        path: "items.rawMaterial",
        select: "name unit averageCost"
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: purchases.length,
      data: purchases
    });

  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate("supplier", "name phone")
      .populate({
        path: "items.rawMaterial",
        select: "name unit averageCost"
      });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    res.status(200).json({
      success: true,
      data: purchase
    });

  } catch (error) {
    console.error("Error fetching purchase:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePurchase = async (req, res) => {
  try {
    const { isActive } = req.body;
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const purchase = await Purchase.findOne({ 
      _id: req.params.id, 
      restaurant: restaurantId 
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    // Update isActive status
    if (isActive !== undefined) {
      purchase.isActive = isActive;
    }

    await purchase.save();

    // Populate response
    await purchase.populate("supplier", "name phone");
    await purchase.populate({
      path: "items.rawMaterial",
      select: "name unit averageCost"
    });

    res.status(200).json({
      success: true,
      message: "Purchase updated successfully",
      data: purchase
    });

  } catch (error) {
    console.error("Error updating purchase:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const purchase = await Purchase.findOne({ 
      _id: req.params.id, 
      restaurant: restaurantId 
    });

    if (!purchase) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found"
      });
    }

    // Soft delete - set isActive to false
    purchase.isActive = false;
    await purchase.save();

    res.status(200).json({
      success: true,
      message: "Purchase deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};