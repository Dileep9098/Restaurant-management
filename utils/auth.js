import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const isAuthenticateUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    next(); 
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// export default isAuthenticateUser;


const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // return next(
      //   new ErrorHander(
      //     `Role: ${req.user.role} is not allowed to access this resouce `,
      //     403
      //   )
      // );

      return res.status(401).json({
        success: false,
        message:  `Role: ${req.user.role} is not allowed to access this resouce `
      });
    }



    next();
  };
};


export { authorizeRoles, isAuthenticateUser };