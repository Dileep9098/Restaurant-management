// import Permissions from "../models/permissionModel.js";



// export const getSidebar = async (req, res) => {
//   try {
//     const userPermissions = req.user.role.permissions; 
//     console.log(req.user.role.permissions)
//     // eg: ["users.view", "roles.view", "dashboard.view"]

//     const permissionModules = await Permissions.find({ isActive: true });

//     const sidebar = permissionModules.map(module => {
//       const allowedSubmenus = module.submenus
//         .map(sub => {
//           const allowedActions = sub.actions.filter(action =>
//             userPermissions.includes(action.key)
//           );

//           if (allowedActions.length === 0) return null;

//           return {
//             name: sub.name,
//             label: sub.label,
//             actions: allowedActions
//           };
//         })
//         .filter(Boolean);

//       if (allowedSubmenus.length === 0) return null;

//       return {
//         module: module.module,
//         moduleLabel: module.moduleLabel,
//         submenus: allowedSubmenus
//       };
//     }).filter(Boolean);

//     res.json({ success: true, data: sidebar });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };




// export const getSidebar = async (req, res) => {
//   try {
//     const userPermissions = req.user.role.permissions;
//     console.log(req.user.role.permissions);

//     const permissionModules = await Permissions.find({ isActive: true });
//     console.log("Kya kya permission Stored hai", permissionModules);

//     const sidebar = permissionModules.map(module => {
//       // Filter submenus based on user permissions 
//       const allowedSubmenus = module.submenus
//         .map(sub => {
//           const allowedActions = sub.actions.filter(action =>
//             userPermissions.includes(action.key)
//           );

//           if (allowedActions.length === 0) return null;

//           return {
//             name: sub.name,
//             label: sub.label,
//             actions: allowedActions
//           };
//         })
//         .filter(Boolean);

//       // ===== CHANGE HERE =====
//       // Always return module, even if allowedSubmenus is empty

//       return {
//         module: module.module,
//         moduleLabel: module.moduleLabel,
//         submenus: allowedSubmenus
//       };
//     });

//     // Optional: filter modules if user has _id permission (like your array has '694144ac4d60635fbc776525')

//     const filteredSidebar = sidebar.filter(mod =>
//       mod.submenus.length > 0 || userPermissions.includes(mod._id)
//     );

//     res.json({ success: true, data: filteredSidebar });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



// export const getSidebar = async (req, res) => {
//   try {
//     const userPermissions = req.user.role.permissions;
//     // console.log("User Permissions:", userPermissions);

//     const permissionModules = await Permissions.find({ isActive: true });
//     // console.log("All permission modules:", permissionModules);

//     const sidebar = permissionModules.map(module => {
//       // Filter submenus based on user permissions
//       const allowedSubmenus = module.submenus
//         .map(sub => {
//           const allowedActions = sub.actions.filter(action =>
//             userPermissions.includes(action.key)
//           );

//           if (allowedActions.length === 0) return null;

//           return {
//             name: sub.name,
//             label: sub.label,
//             actions: allowedActions
//           };
//         })
//         .filter(Boolean);

//       // ===== LOGIC: Include empty submenus module if user has permission =====
//       const includeEmptyModule =
//         allowedSubmenus.length > 0 || 
//         userPermissions.includes(module._id.toString()) || 
//         userPermissions.includes(module.module); // optional: module name permission

//       if (!includeEmptyModule) return null;

//       return {
//         _id: module._id, // include _id for frontend toggle
//         module: module.module,
//         moduleLabel: module.moduleLabel,
//         icon: module.icon,
//         submenus: allowedSubmenus // can be empty
//       };
//     }).filter(Boolean);

//     res.json({ success: true, data: sidebar });

//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


import Permissions from "../models/permissionModel.js";
import RolePermission from "../models/RolePermissionModel.js";

// import Permissions from "../models/permissionModel.js";
// import RolePermissionModel from "../models/RolePermissionModel.js";

// export const getSidebar = async (req, res) => {
//   try {
//     const userRoleId = req.user.role?._id || req.user.role;
//     const restaurantId = req.user.restaurant?._id || req.user.restaurant;

//     console.log("roleId:", userRoleId);
//     console.log("restaurantId:", restaurantId);

//     const mappings = await RolePermission.find({
//       role: userRoleId,
//       restaurant: restaurantId
//     });

//     console.log("mappings length:", mappings.length);

//     // If no mappings, return empty sidebar clearly
//     if (!mappings.length) {
//       return res.json({
//         success: true,
//         data: [],
//         message: "No permissions assigned to this role for this restaurant"
//       });
//     }

//     const allowedActionKeys = new Set();

//     mappings.forEach(m => {
//       m.permissions?.forEach(key => allowedActionKeys.add(key));
//     });

//     console.log("allowedActionKeys sample:", Array.from(allowedActionKeys).slice(0, 15));

//     const permissionModules = await Permissions.find({ isActive: true });

//     const sidebar = permissionModules.map(module => {
//       const allowedSubmenus = (module.submenus || [])
//         .map(sub => {
//           const allowedActions = (sub.actions || []).filter(a => allowedActionKeys.has(a.key));
//           if (!allowedActions.length) return null;
//           return { name: sub.name, label: sub.label };
//         })
//         .filter(Boolean);

//       if (!allowedSubmenus.length) return null;

//       return {
//         _id: module._id,
//         module: module.module,
//         moduleLabel: module.moduleLabel,
//         icon: module.icon,
//         submenus: allowedSubmenus
//       };
//     }).filter(Boolean);

//     console.log("sidebar length:", sidebar.length);

//     return res.json({ success: true, data: sidebar });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

export const getSidebar = async (req, res) => {
  try {
    const userRoleId = req.user.role?._id || req.user.role;
    const restaurantId = req.user.restaurant?._id || req.user.restaurant;

    const mappings = await RolePermission.find({
      role: userRoleId,
      restaurant: restaurantId
    });

    if (!mappings.length) {
      return res.json({
        success: true,
        data: [],
        message: "No permissions assigned"
      });
    }
    // console.log("Role-Permission Mappings Found:", mappings);

    const allowedActionKeys = new Set();
    mappings.forEach(m => {
      m.permissions?.forEach(key => allowedActionKeys.add(key));
    });

    const permissionModules = await Permissions.find({ isActive: true });

    const sidebar = permissionModules.map(module => {
      const isModuleAllowed = allowedActionKeys.has(module._id.toString());

      const allowedSubmenus = (module.submenus || [])
        .map(sub => {
          const allowedActions = (sub.actions || []).filter(a =>
            allowedActionKeys.has(a.key)
          );
          if (!allowedActions.length) return null;

          return {
            name: sub.name,
            label: sub.label
          };
        })
        .filter(Boolean);

      if (!isModuleAllowed && !allowedSubmenus.length) return null;

      return {
        _id: module._id,
        module: module.module,
        moduleLabel: module.moduleLabel,
        icon: module.icon,
        submenus: allowedSubmenus
      };
    }).filter(Boolean);

    return res.json({
      success: true,
      data: sidebar
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
