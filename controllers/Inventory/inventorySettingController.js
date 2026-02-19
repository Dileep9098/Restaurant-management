import InventorySetting from "../../models/Inventory/InventorySetting.js";

// Get Settings
export const getInventorySettings = async (req, res) => {
  try {
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    let settings = await InventorySetting.findOne({ restaurant: restaurantId });

    if (!settings) {
      settings = await InventorySetting.create({ restaurant: restaurantId });
    }

    res.json(settings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Settings
export const updateInventorySettings = async (req, res) => {
  try {
    const restaurantId = req.user.restaurant || req.body.restaurant;
    
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }

    const settings = await InventorySetting.findOne({ restaurant: restaurantId });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    Object.assign(settings, req.body);
    await settings.save();

    res.json(settings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};