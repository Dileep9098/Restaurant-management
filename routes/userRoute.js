// import express from "express"
// import { bulkExcelUpload, deleteUser, getAllUser, login, logout, register, updateUser } from "../controllers/userController.js";
// import isAuthenticateUser from "../utils/auth.js"
// const router=express.Router()

// import multer from "multer"

// const bulkExcelStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, 'uploads/'));
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     },
// });

// const upload = multer({ storage: bulkExcelStorage });

// router.route("/register").post(register)
// router.route("/login").post(login)
// router.route("/logout").get(logout);
// router.route("/get-all-user").get(getAllUser);
// router.route("/update-user/:id").put(updateUser);
// router.route("/delete-user/:id").delete(deleteUser);

// router.route("/admin/bulk-upload-excel").post(upload.single("file"),bulkExcelUpload)

// export default router



import express from "express";
import path from "path";
import multer from "multer";
import {

  createAdminUser,
  deleteUser,
  forgotPassword,
  getAllRestaurentUser,
  getAllUser,

  getPendingKYCUsers,

  getSingleUser,

  getUserDetails,
  login,
  logout,
  register,
  resetPassword,
  // submitKYC,
  // updateKYCStatus,
  updatePassword,
  updateRolePermission,
  updateUser,
  verifyOTP,
} from "../controllers/userController.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
import { authorizeRoles, isAuthenticateUser } from "../utils/auth.js";
import { uploadKYC } from "../middleWares/kyc.js";
import auth from "../middleware/auth.js";
import checkPermission from "../middleware/checkPermission.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// ------------------- Routes -------------------

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/otp-verified").post(verifyOTP);
router.route("/forgote-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/update-password").post(isAuthenticateUser, updatePassword);
router.route("/logout").get(auth, logout); 
router.route("/me").get(auth, getUserDetails);
router.route("/admin/create-user").post(auth, createAdminUser);

router.route("/get-all-user").get( getAllUser);
router.route("/get-all-restaurent-user").get(auth, getAllRestaurentUser);
router.route("/update-user/:id").put(isAuthenticateUser, updateUser);
router.route("/delete-user/:id").delete(auth, checkPermission("user.delete"), deleteUser);
router.route("/admin/single-user/:id").get(isAuthenticateUser, authorizeRoles("admin"), getSingleUser)
// router.route("/admin/update-user-role/:id").put(isAuthenticateUser, authorizeRoles("admin"), updateRolePermission)
router.put("/admin/update-user-role/:id", updateRolePermission);


// 🔥 Main Route: Excel Upload
// router
//   .route("/admin/bulk-upload-excel")
//   .post( upload.single("file"), bulkExcelUpload);



// KYC Routes 

//  User submits KYC
// router
//   .route("/kyc/submit")
//   .post(isAuthenticateUser, uploadKYC.fields([
//     { name: "aadharFrontImage", maxCount: 1 },
//     { name: "aadharBackImage", maxCount: 1 }
//   ]), submitKYC);

// Admin updates KYC status
// router
//   .route("/admin/kyc-status")
//   .put(isAuthenticateUser, authorizeRoles("admin"), updateKYCStatus);

// 👁️ Admin gets all pending KYC requests
// router
//   .route("/admin/kyc-pending")
//   .get(isAuthenticateUser, authorizeRoles("admin"), getPendingKYCUsers);

export default router;
