// import express from "express";
// import { isAuthenticateUser, authorizeRoles } from "../utils/auth.js";
// import { getAllOrders, getMyOrders, getSingleOrder, markOrderAsShipped, placeOrder } from "../controllers/orderController.js";

// const router = express.Router();

// router.post("/create-order", isAuthenticateUser, authorizeRoles("vendor"), placeOrder);

// router.route("/admin/get-all-order-data").get(isAuthenticateUser,authorizeRoles("admin"),getAllOrders)
// router.route("/my-order-data").get(isAuthenticateUser,getMyOrders)
// router.route("/admin/get-single-order-details/:id").get(isAuthenticateUser,getSingleOrder)
// router.route("/admin/order/:id/shipped").put(isAuthenticateUser,authorizeRoles("admin"),markOrderAsShipped)

// export default router;


import express from "express";
import { downloadInvoice, getMyOrder, getOrders, placeOrder, updateOrderStatus, updatePreparationTime } from "../controllers/orderController.js";
import auth from "../middleware/auth.js";


const router = express.Router();


router.post( "/place-order", placeOrder);


router.get( "/get-all-order",auth, getOrders);
router.get("/get-my-orders",getMyOrder)


router.put( "/update-order-stauts/:id", auth, updateOrderStatus);

router.put( "/update-preparation-time/:id", auth, updatePreparationTime);

router.get("/download-invoice/:id", downloadInvoice);



export default router;
