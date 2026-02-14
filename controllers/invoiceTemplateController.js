// controllers/invoiceTemplateController.js

// import InvoiceTemplate from "../models/invoiceTemplateModel.js";
import Restaurant from "../models/restaurentModel.js"

// export const createInvoiceTemplate = async (req, res) => {
//   try {
//     const { name, code, description, isDefault } = req.body;

//     if (!name || !code) {
//       return res.status(400).json({
//         success: false,
//         message: "Name and code are required",
//       });
//     }

//     if (isDefault) {
//       await InvoiceTemplate.updateMany(
//         { isDefault: true },
//         { isDefault: false }
//       );
//     }

//     const template = await InvoiceTemplate.create({
//       name,
//       code,
//       description,
//       isDefault,
//     });

//     res.status(201).json({
//       success: true,
//       template,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Template creation failed",
//     });
//   }
// };


// export const getAllInvoiceTemplates = async (req, res) => {
//   try {
//     const templates = await InvoiceTemplate.find({ isActive: true });

//     res.json({
//       success: true,
//       templates,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch templates",
//     });
//   }
// };



// export const setRestaurantTemplate = async (req, res) => {
//   try {
//     const { restaurantId } = req.params;
//     const { templateId } = req.body;

//     const restaurant = await Restaurant.findByIdAndUpdate(
//       restaurantId,
//       { invoiceTemplate: templateId },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       restaurant,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to set template",
//     });
//   }
// };





import InvoiceTemplate from "../models/invoiceTemplateModel.js";
import slugify from "slugify";


export const createInvoiceTemplate = async (req, res) => {
  try {
    const { restaurant, name, code, description, isDefault } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and Code are required",
      });
    }

    const existing = await InvoiceTemplate.findOne({ code });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Template code already exists",
      });
    }

    // if setting default -> remove previous default
    if (isDefault) {
      await InvoiceTemplate.updateMany(
        { restaurant },
        { isDefault: false }
      );
    }

    const template = await InvoiceTemplate.create({
      restaurant,
      name,
      slug: slugify(name),
      code,
      description,
      previewImage: req.file ? req.file.filename : null,
      isDefault,
    });

    res.status(201).json({
      success: true,
      message: "Invoice Template Created Successfully",
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllInvoiceTemplates = async (req, res) => {
  try {
    const templates = await InvoiceTemplate.find({
      restaurant: req.user.restaurant,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: templates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateInvoiceTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, isDefault, isActive } = req.body;

    const template = await InvoiceTemplate.findById(id);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    if (isDefault) {
      await InvoiceTemplate.updateMany(
        { restaurant: template.restaurant },
        { isDefault: false }
      );
    }

    template.name = name || template.name;
    template.slug = name ? slugify(name) : template.slug;
    template.code = code || template.code;
    template.description = description || template.description;
    template.isDefault = isDefault ?? template.isDefault;
    template.isActive = isActive ?? template.isActive;

    if (req.file) {
      template.previewImage = req.file.filename;
    }

    await template.save();

    res.status(200).json({
      success: true,
      message: "Invoice Template Updated Successfully",
      data: template,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteInvoiceTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await InvoiceTemplate.findById(id);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    await template.deleteOne();

    res.status(200).json({
      success: true,
      message: "Invoice Template Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const setRestaurantTemplate = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { templateId } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { invoiceTemplate: templateId },
      { new: true }
    );

    res.json({
      success: true,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to set template",
    });
  }
};
