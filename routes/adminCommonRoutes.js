import express from "express";
import auth from "../middleware/auth.js";
import checkPermission from "../middleware/checkPermission.js";
import { createTax, deleteTax, getAllTax, updateTax } from "../controllers/taxController.js";


const router = express.Router();

router.post("/create-tax", auth, checkPermission("tax_GST.create"), createTax);
router.get("/get-all-taxes", auth, checkPermission("tax_GST.view"),getAllTax);
router.put("/update-tax/:id", auth, checkPermission("tax_GST.update"), updateTax);
router.delete("/delete-tax/:id", auth, checkPermission("tax_GST.delete"), deleteTax);


export default router;
