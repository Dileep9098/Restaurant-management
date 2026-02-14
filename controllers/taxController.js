import Tax from "../models/taxModel.js";


export const createTax = async (req, res) => {
  try {
    const { name, percent, appliesTo } = req.body;

    if (!name || percent === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name & percent are required"
      });
    }

    const tax = await Tax.create({
      restaurant: req.user.restaurant,
      name,
      percent,
      appliesTo
    });

    res.status(201).json({
      success: true,
      data: tax
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const getAllTax = async (req, res) => {
  try {
    const taxes = await Tax.find({
      restaurant: req.user.restaurant,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: taxes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const updateTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tax) {
      return res.status(404).json({
        success: false,
        message: "Tax not found"
      });
    }

    res.json({
      success: true,
      data: tax
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    res.json({
      success: true,
      message: "Tax disabled successfully"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
