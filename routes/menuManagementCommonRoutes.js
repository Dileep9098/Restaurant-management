import express from "express";
import auth from "../middleware/auth.js";
import checkPermission from "../middleware/checkPermission.js";
import { createTax, deleteTax, getAllTax, updateTax } from "../controllers/taxController.js";
import { createVariant, createVariantGroup, deleteVariant, deleteVariantGroup, getVariantsByGroup, getVariantGroupsByItem, updateVariant, updateVariantGroup } from "../controllers/variantController.js";
import { createAddOn, createAddOnGroup, deleteAddOn, deleteAddOnGroup, getAddOnGroups, getAddOnsByGroup, updateAddOn, updateAddOnGroup } from "../controllers/addOnController.js";
import { createTable, deleteTable, getTablesByRestaurant, updateTable } from "../controllers/menuManagementController.js";



const router = express.Router();

router.post("/create-tax", auth, checkPermission("tax_GST.create"), createTax);
router.get("/get-all-taxes", auth, checkPermission("tax_GST.view"),getAllTax);
router.put("/update-tax/:id", auth, checkPermission("tax_GST.update"), updateTax);
router.delete("/delete-tax/:id", auth, checkPermission("tax_GST.delete"), deleteTax);


// variant group and variant routes will be here

router.post("/create-variant-group", auth, checkPermission("variants.create"), createVariantGroup);
router.get("/get-variant-groups/:id", auth, checkPermission("variants.view"), getVariantGroupsByItem);
router.put("/update-variant-group/:id", auth, checkPermission("variants.update"), updateVariantGroup);
router.delete("/delete-variant-group/:id", auth, checkPermission("variants.delete"), deleteVariantGroup);

router.post("/create-variant", auth, checkPermission("variants.create"), createVariant);
router.get("/get-variants/:groupId", auth, checkPermission("variants.view"), getVariantsByGroup);
router.put("/update-variant/:id", auth, checkPermission("variants.update"), updateVariant);
router.delete("/delete-variant/:id", auth, checkPermission("variants.delete"), deleteVariant);   


// AddOn Modified routes will be here

router.post("/create-addon-group", auth, checkPermission("add-ons_modifiers.create"), createAddOnGroup);
router.get("/get-addon-groups/:menuItemId", auth, checkPermission("add-ons_modifiers.view"), getAddOnGroups);
router.put("/update-addon-group/:id", auth, checkPermission("add-ons_modifiers.update"), updateAddOnGroup);
router.delete("/delete-addon-group/:id", auth, checkPermission("add-ons_modifiers.delete"), deleteAddOnGroup);

router.post("/create-addon", auth, checkPermission("add-ons_modifiers.create"), createAddOn);
router.get("/get-addons/:addOnGroupId", auth, checkPermission("add-ons_modifiers.view"), getAddOnsByGroup);
router.put("/update-addon/:id", auth, checkPermission("add-ons_modifiers.update"), updateAddOn);
router.delete("/delete-addon/:id", auth, checkPermission("add-ons_modifiers.delete"), deleteAddOn);


// tables 

router.post("/create-table", auth, checkPermission("tables.create"), createTable);
router.get("/get-tables/:restaurantId", auth, checkPermission("tables.view"), getTablesByRestaurant);
router.put("/update-table/:id", auth, checkPermission("tables.update"), updateTable);
router.delete("/delete-table/:id", auth, checkPermission("tables.delete"), deleteTable);




export default router;
