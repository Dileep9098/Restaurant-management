import Permissions from "../models/permissionModel.js";
import RolePermissionModel from "../models/RolePermissionModel.js";

export const createPermission = async (req, res) => {
  try {
    const { icon, module, moduleLabel, submenus } = req.body;

    if (!module || !moduleLabel) {
      return res.status(400).json({
        success: false,
        message: "Module and Module Label are required",
      });
    }

    const exists = await Permissions.findOne({ module });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Module already exists",
      });
    }

    const permission = await Permissions.create({
      module,
      icon,
      moduleLabel,
      submenus: submenus || [],
    });

    res.status(201).json({
      success: true,
      message: "Permission module created successfully",
      data: permission,
    });

  } catch (error) {
    console.error("Create Permission Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permissions.find();
    res.status(200).json({

      success: true,
      data: permissions,
    });
  }
  catch (error) {

    console.error("Get All Permissions Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const {module, moduleLabel, submenus, icon } = req.body;
    const permission = await Permissions.findById(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission module not found",
      });
    }
    permission.moduleLabel = moduleLabel || permission.moduleLabel;
    permission.submenus = submenus || permission.submenus;
    permission.icon = icon || permission.icon;
    permission.module = module || permission.module;
    await permission.save();
    res.status(200).json({
      success: true,
      message: "Permission module updated successfully",
      data: permission,
    });
  } catch (error) {
    console.error("Update Permission Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await Permissions
      .findByIdAndDelete(id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission module not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Permission module deleted successfully",
    });
  } catch (error) {
    console.error("Delete Permission Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }

};


export const getAllAssignPermission = async (req, res) => {
  try {
    const permissions = await RolePermissionModel.find().populate("role","name").populate("restaurant","name");

    return res.status(200).json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error("Error fetching assigned permissions:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch assigned permissions",
      error: error.message,
    });
  }
};
