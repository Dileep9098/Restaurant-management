import express from "express";
import { getCustomerMenu } from "../controllers/customerMenuController.js";

const router = express.Router();

router.get("/menu", getCustomerMenu);

export default router;
