import express from 'express';
import { authorizeRoles, isAuthenticateUser } from '../utils/auth.js';
import { addPaymentMethod, deletePaymentMethod, getAllPaymentMethods, getPaymentMethodById, updatePaymentMethod } from '../controllers/paymentMethodController.js';

const router = express.Router();

router.route("/add-payment-method").post(isAuthenticateUser, authorizeRoles("admin"), addPaymentMethod)

router.route("/all-payment-method").get(getAllPaymentMethods)
router.route("/update-payment-method/:id").put(isAuthenticateUser, authorizeRoles("admin"), updatePaymentMethod)
router.route("/get-single-payment-method/:id").get(isAuthenticateUser, getPaymentMethodById)
router.route("/delete-payment-method/:id").delete(isAuthenticateUser, authorizeRoles("admin"), deletePaymentMethod)



export default router;
