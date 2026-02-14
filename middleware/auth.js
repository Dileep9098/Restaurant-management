// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";
// import RolePermissionModel from "../models/RolePermissionModel.js";

// export const auth = async (req, res, next) => {
//   try {
//     // console.log("Auth Middleware Invoked",req.headers);
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "Token missing" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).populate("role");
//     if (!user) return res.status(401).json({ message: "Invalid token user" });
//     const rolePermission = await RolePermissionModel.findOne({
//       restaurant: user.restaurant,
//       role: user.role._id,
//       isActive: true
//     });

//     req.user = user;
//     req.permissions = rolePermission.length > 0 ? rolePermission[0].permissions : [];
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };

// export default auth;



import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import RolePermissionModel from "../models/RolePermissionModel.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).populate("role");
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    const rolePermission = await RolePermissionModel.findOne({
      restaurant: user.restaurant,
      role: user.role._id,
      isActive: true
    });

    req.user = user;
    req.permissions = rolePermission?.permissions || [];

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default auth;