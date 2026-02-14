import Permissions from "../models/permissionModel.js";
import Role from "../models/roleModel.js";
import RolePermission from "../models/RolePermissionModel.js";


export const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.json({ success: true, data: role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRoles = async (req, res) => {
  try {
    const { restaurantId } = req.query;
    console.log("Restaurant6 ID hghj:", req.user.restaurant);
    const filter = { restaurant: req.user.restaurant };
    const roles = await Role.find(filter);
    res.json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ error: err.message, success: false });
  }
};


export const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json({ success: true, data: role });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }

};

export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.json({ success: true, message: "Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};







/**
 * ✅ Assign Permission to Role
 * POST /api/role-permissions
 */
export const assignPermissionToRole = async (req, res) => {
  try {
    const { role, isActive, permissions, restaurant } = req.body;

    if (!role || !permissions || !restaurant) {
      return res.status(400).json({
        success: false,
        message: "role and permissionId are required"
      });
    }

    // validate role
    const roleId = await Role.findById(role);
    if (!roleId) {
      return res.status(404).json({
        success: false,
        message: "Role not found"
      });
    }

    // validate permission
    // const permission = await Permissions.findById(permissionId);
    // if (!permission) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Permission not found"
    //   });
    // }

    // // prevent duplicate
    // const exists = await RolePermission.findOne({
    //   role: roleId,
    //   permission: permissionId
    // });

    // if (exists) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Permission already assigned to this role"
    //   });
    // }

    // check for existing role permission for the same role
    const existingRolePermission = await RolePermission.findOne({ role: role });
    if (existingRolePermission) {

      return res.status(200).json({
        success: false,
        message: "Permissions Role already exists",
        data: existingRolePermission
      });
    }

    const rolePermission = await RolePermission.create({
      role: roleId,
      permissions: permissions,
      restaurant: restaurant,
      isActive: isActive
    });

    res.status(201).json({
      success: true,
      message: "Permission assigned to role successfully",
      data: rolePermission
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ✅ Get All Permissions of a Role
 */
export const getPermissionsByRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const permissions = await RolePermission.find({ role: roleId })
      .populate("permission")
      .populate("role", "name");

    res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ✅ Remove Permission from Role
 */
export const removePermissionFromRole = async (req, res) => {
  try {
    const record = await RolePermission.findById(req.params.id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Role permission not found"
      });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: "Permission removed from role successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET /api/role-permissions
 */
export const getAllRolePermissions = async (req, res) => {
  try {
    if (!req.user || !req.user.restaurant) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or restaurant not found"
      });
    }
    const data = await RolePermission.find({ restaurant: req.user.restaurant })
      .populate("role", "name restaurant")
      .populate("restaurant", "name")
    res.status(200).json({
      success: true,
      count: data.length,
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const updateRolePermission = async (req, res) => {
  try {
    const { role, permissions, isActive } = req.body;
    const rolePermission = await RolePermission.findByIdAndUpdate(
      req.params.id,
      { role, permissions, isActive },
      { new: true }
    );
    if (!rolePermission) {
      return res.status(404).json({ message: "Role Permission not found" });
    }
    res.json({ success: true, data: rolePermission });
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getSingleRoleAssignPermission = async (req, res) => {
  console.log("Restaurant ID:", req.user);
  try {
    if (!req.user || !req.user.restaurant) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or restaurant not found"
      });
    }
    console.log("User Restaurant ID:", req.user.restaurant);
    const { roleId } = req.query; // Get roleId from query params
    const filter = { restaurant: req.user.restaurant };
    if (roleId) {
      filter.role = roleId;
    }
    const rolePermissions = await RolePermission.find(filter).populate("role", "name").populate("restaurant", "name");

    // Collect all permission IDs (ObjectId strings)
    const permissionIds = [];
    rolePermissions.forEach(rp => {
      rp.permissions.forEach(p => {
        if (p.match(/^[0-9a-fA-F]{24}$/)) { // Check if it's an ObjectId string
          permissionIds.push(p);
        }
      });
    });

    // Fetch permission details
    const uniqueIds = [...new Set(permissionIds)];
    const permissionDetails = await Permissions.find({ _id: { $in: uniqueIds } });

    // Create map for quick lookup
    const permMap = {};
    permissionDetails.forEach(p => {
      permMap[p._id.toString()] = p;
    });

    // Replace IDs with full objects in the response
    const data = await Promise.all(rolePermissions.map(async (rp) => {
      const rpObj = rp.toObject();
      // Get action keys (non-ID strings)
      const actionKeys = rp.permissions.filter(p => !p.match(/^[0-9a-fA-F]{24}$/));
      console.log("Action keys for role:", rp.role.name, actionKeys);
      // Get module IDs
      const moduleIds = rp.permissions.filter(p => p.match(/^[0-9a-fA-F]{24}$/));

      // Fetch Permissions for modules with allowed submenus
      const submenuPermissions = await Permissions.find({ 'submenus.actions.key': { $in: actionKeys } });
      console.log("Submenu permissions found:", submenuPermissions.length);

      // Filter and process
      const processedSubmenuPerms = submenuPermissions.map(perm => {
        const permObj = perm.toObject();
        permObj.submenus = perm.submenus.filter(sub =>
          sub.actions.some(act => actionKeys.includes(act.key))
        );
        return permObj;
      });

      // Combine module permissions and submenu permissions
      const modulePerms = moduleIds.map(id => permMap[id]).filter(Boolean);
      rpObj.permissions = [...modulePerms, ...processedSubmenuPerms];

      return rpObj;
    }));

    console.log("Restaurent ko kya kya permission hai", data);
    return res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
