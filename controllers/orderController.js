// import Notification from "../models/notificationModel.js";
// import Order from "../models/orderModel.js";
// import SimData from "../models/SimDataModel.js";
// import User from "../models/userModel.js";
// import { io } from "../server.js";


// const generateOrderNumber = async () => {
//   const orderCount = await Order.countDocuments();
//   const orderNumber = `OR#${(orderCount + 1).toString().padStart(8, '0')}`;
//   console.log(orderNumber)
//   return orderNumber;
// };


// export const placeOrder = async (req, res) => {
//   try {
//     const { items, totalAmount } = req.body;
//     const UserID = req.user._id;

//     const user = await User.findById(UserID);

//     if (!user || user.role !== "vendor") {
//       return res.status(403).json({ message: "Access denied" });
//     }

//     // Check wallet balance
//     if (user.wallet < totalAmount) {
//       return res.status(400).json({ message: "Insufficient wallet balance" });
//     }

//     const orderNumber = await generateOrderNumber();


//     // Create order
//     const newOrder = await Order.create({
//       UserID: UserID,
//       OrderNumber: orderNumber,
//       items,
//       totalAmount
//     });

//     // Deduct amount from wallet
//     user.wallet -= totalAmount;
//     // user.walletTransactions.push({
//     //   type: "DEBIT",
//     //   amount: totalAmount,
//     //   description: `Order #${newOrder._id} payment of ₹${totalAmount}`

//     // });

//     // const itemNames = items.map(item => item.packageId?.name || "Package").join(", ");
//     await newOrder.populate("items.packageId");

//     const itemNames = newOrder.items.map(item => item.packageId?.name || "Package").join(", ");


//     user.walletTransactions.push({
//       type: "DEBIT",
//       amount: totalAmount,
//       description: `Order for ${itemNames} - ₹${totalAmount} debited from wallet`
//     });

//     io.to((UserID).toString()).emit("new_walletAmount", user.wallet);

//     await user.save();

//     const admins = await User.find({ role: "admin" });

//     for (const admin of admins) {
//       const notification = new Notification({
//         sender: UserID,
//         receiver: admin._id,
//         message: `User ${req.user.name} placed Order #${newOrder.OrderNumber} of ₹${totalAmount}`,
//         type: "ORDER"
//       });

//       await notification.save();
//       io.to((admin._id).toString()).emit("new_notification", notification);
//     }



//     res.status(201).json({
//       message: "Order placed successfully",
//       order: newOrder
//     });

//   } catch (error) {
//     console.log("Order Error:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };


// export const getAllOrders = async (req, res) => {

//   const orderCount = await Order.countDocuments()

//   try {
//     const findOrder = await Order.find().sort({ createdAt: -1 }).populate("UserID");

//     if (!findOrder || findOrder.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "findOrder Not Found",
//       });
//     }
//     let totalAmount = 0;

//     findOrder.forEach((order) => {
//       const orderPrice = order.totalAmount;
//       if (orderPrice !== null && orderPrice !== undefined && !isNaN(parseFloat(orderPrice))) {
//         totalAmount += parseFloat(orderPrice);
//       }
//       //  else {
//       //   console.log("Invalid Order Price:", orderPrice); // For debugging invalid values
//       // }
//     });

//     res.status(200).json({
//       success: true,
//       findOrder,
//       orderCount,
//       totalAmount
//     });

//   } catch (error) {
//     console.error("Error fetching findOrder:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server Error while fetching findOrder",
//     });
//   }
// }



// export const getSingleOrder = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("UserID", "name email phone city status -password")
//       .populate("items.packageId");

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     console.error("Get Single Order Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// export const getMyOrders = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const orders = await Order.find({ UserID: userId }).sort({ createdAt: -1 })
//       .sort({ createdAt: -1 })
//       .populate("items.packageId")
//       .populate("UserID", "name email -password");

//     res.status(200).json({ success: true, orders });
//   } catch (error) {
//     console.error("Get My Orders Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };



// export const markOrderAsShipped = async (req, res) => {
//   try {
//     const orderId = req.params.id;

//     const order = await Order.findById(orderId).populate("UserID");
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     const userId = order.UserID._id;
//     const userName = order.UserID.name;

//     // Calculate total quantity from all items
//     const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

//     // Get unassigned SIMs
//     const availableSims = await SimData.find({ isAssigned: false }).limit(totalQuantity);

//     if (availableSims.length < totalQuantity) {
//       return res.status(400).json({ message: "Not enough available SIMs" });
//     }

//     // Assign SIMs
//     for (let i = 0; i < totalQuantity; i++) {
//       availableSims[i].isAssigned = true;
//       availableSims[i].assignedTo = userId;
//       availableSims[i].userName = userName; // add this in schema if not present
//       await availableSims[i].save();
//     }

//     // Update order status
//     order.status = "Shipped";
//     await order.save();

//     res.status(200).json({
//       message: `Order marked as shipped. ${totalQuantity} SIMs assigned to ${userName}`,
//     });
//   } catch (error) {
//     console.error("Error in shipping order:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getSingleOrder = async (req, res, next) => {
//   const order = await Order.findById(req.params.id).populate("UserID");

//   // if (!order) {
//   //   return next(new ErrorHandler("Order not found with this Id", 404));
//   // }
//   if (!order) {
//     return res.status(404).json({
//       success: false,
//       message: "Order not found with this Id",
//     });
//   }

//   // const paymentDetails = await PaymentMethod.find({ 'displaySeqNo': { $in: order.PaymentMethod } });



//   res.status(200).json({
//     success: true,
//     order
//   });
// }



// exports.myOrders = catchAsyncError(async (req, res, next) => {
//   const data = req.body; // Get the data from the body
//   console.log("Request Body:", data); // Log the full request body to see its contents
//   const userID = data.UserID || req.body.UserID; // Extract UserID from request body

//   if (!userID) {
//     return res.status(400).json({
//       success: false,
//       message: 'UserID is required',
//     });
//   }

//   const orders = await OrderItem.find({ UserID: userID });
//   console.log("Found orders:", orders); // Log orders fetched from DB

//   res.status(200).json({
//     success: true,
//     orders,
//   });
// });

// exports.deleteMyOrders = catchAsyncError(async (req, res, next) => {
//   const data = req.body;
//   console.log("Request Body:", data);

//   const id = data.id || req.body.id;

//   if (!id) {
//     return res.status(400).json({
//       success: false,
//       message: 'Order ID is required',
//     });
//   }

//   try {
//     // Use _id for the delete query, assuming you're using MongoDB
//     const order = await OrderItem.deleteOne({ _id: id });
//     const shippingDetails = await ShippingDetails.deleteOne({ 'orderItem': id });


//     if (order.deletedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found',
//       });
//     }

//     console.log("Deleted order:", order);

//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting order:", error);
//     return res.status(500).json({
//       success: false,
//       message: 'Something went wrong while deleting the order.',
//     });
//   }
// });


// // get all Orders -- Admin
// exports.getAllOrders = catchAsyncError(async (req, res, next) => {
//   const orders = await OrderItem.find().sort({ createdAt: -1 }).populate("UserID");

//   let totalAmount = 0;

//   orders.forEach((order) => {
//     totalAmount += parseFloat(order.totalOrderPrice);
//   });

//   console.log("Kya total hai",totalAmount)

//   res.status(200).json({
//     success: true,
//     totalAmount,
//     orders,
//   });
// });





// exports.getAllOrders = catchAsyncError(async (req, res, next) => {
//   try {
//     const orders = await OrderItem.find().sort({ createdAt: -1 }).populate("UserID");

//     let totalAmount = 0;

//     orders.forEach((order) => {
//       const orderPrice = order.totalOrderPrice;
//       if (orderPrice !== null && orderPrice !== undefined && !isNaN(parseFloat(orderPrice))) {
//         totalAmount += parseFloat(orderPrice);
//       }
//       //  else {
//       //   console.log("Invalid Order Price:", orderPrice); // For debugging invalid values
//       // }
//     });

//     console.log("Final Total Amount:", totalAmount); // Check totalAmount before sending response

//     res.status(200).json({
//       success: true,
//       totalAmount,
//       orders,
//     });
//   } catch (error) {
//     next(error); // Pass any error to the global error handler
//   }
// });


// // update Order Status -- Admin
// exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHander("Order not found with this Id", 404));
//   }

//   if (order.orderStatus === "Delivered") {
//     return next(new ErrorHander("You have already delivered this order", 400));
//   }

//   if (req.body.status === "Shipped") {
//     order.orderItems.forEach(async (o) => {
//       await updateStock(o.product, o.quantity);
//     });
//   }
//   order.orderStatus = req.body.status;

//   if (req.body.status === "Delivered") {
//     order.deliveredAt = Date.now();
//   }

//   await order.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true,
//   });
// });

// async function updateStock(id, quantity) {
//   const product = await Product.findById(id);

//   product.Stock -= quantity;

//   await product.save({ validateBeforeSave: false });
// }

// // delete Order -- Admin
// exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next(new ErrorHander("Order not found with this Id", 404));
//   }

//   await order.remove();

//   res.status(200).json({
//     success: true,
//   });
// });




// exports.addShippingDetails = catchAsyncError(async (req, res, next) => {
//   // Fetch order details using order ID
//   const order = await OrderItem.findById(req.params.id).populate("UserID");

//   if (!order) {
//     return next(new ErrorHander("Order not found with this Id", 404));
//   }

//   const cartItems = JSON.parse(order.cartJsonData);

//   for (const item of cartItems) {
//     const shippingDetail = {
//       orderItem: order._id,
//       ProductImage: item.DefaultImage,
//       ProductName: item.ProductName,
//       shippingStatus:order.Status

//     };

//     await ShippingDetails.create(shippingDetail);
//   }

//   res.status(200).json({
//     success: true,
//     message: "Shipping details added successfully."
//   });
// });


// exports.getShippingDetails = catchAsyncError(async (req, res, next) => {
//   // Fetch order details using order ID
//   const shippingDetails = await ShippingDetails.find({ 'orderItem': { $in: req.params.id } }).populate(["orderItem", "UserID"]);

//   if (!shippingDetails) {
//     return next(new ErrorHandler("Order not found with this Id", 404));
//   }

//   res.status(200).json({
//     success: true,
//     shippingDetails,
//     message: "Shipping details successfully."
//   });
// });


// exports.updateShippingDetails = catchAsyncError(async (req, res, next) => {
//   const data = req.body;
//   console.log("update Data me Details kya hai", data);

//   // Find the ShippingDetails by orderItem ID
//   const shippingDetails = await ShippingDetails.findOne({ 'orderItem': { $in: req.params.id } }).populate(["orderItem", "UserID"]);

//   if (!shippingDetails) {
//     return next(new ErrorHandler("Order not found with this Id", 404));
//   }

//   // Update the shipping details with the new data
//   shippingDetails.shipper = data.Shipper || shippingDetails.shipper;
//   shippingDetails.length = data.length || shippingDetails.length;
//   shippingDetails.height = data.height || shippingDetails.height;
//   shippingDetails.weight = data.weight || shippingDetails.weight;
//   shippingDetails.breadth = data.breadth || shippingDetails.breadth;
//   shippingDetails.TrackingNumber = data.TrackingNumber || shippingDetails.TrackingNumber;
//   shippingDetails.departure_date = data.departureDate || shippingDetails.departure_date;
//   shippingDetails.receiver_date = data.receivedDate || shippingDetails.receiver_date;
//   shippingDetails.shippingMethod = data.shippingMethod || shippingDetails.shippingMethod;
//   shippingDetails.shippingStatus = data.ShippingStatus || shippingDetails.shippingStatus;  // Fixed this line
//   shippingDetails.receiver_name = data.receiverName || shippingDetails.receiver_name;
//   shippingDetails.receiver_mobile = data.receiverMobile || shippingDetails.receiver_mobile;
//   shippingDetails.receiver_indentity_no = data.receiverIdentityNo || shippingDetails.receiver_indentity_no;

//   // Save the updated shipping details
//   await shippingDetails.save();

//   const findOrder = await OrderItem.findById(req.params.id);

//   if (findOrder) {
//     findOrder.Status = data.ShippingStatus || findOrder.Status;
//     await findOrder.save();
//     console.log("Order Ka Status kya hai", findOrder.Status);
//   } else {
//     return next(new ErrorHandler("OrderItem not found with this Id", 404));
//   }


//   // -----------------------------------------||||||   Check Shiprocket Token   ||||------------------------

//   try {
//     if (data.ShippingStatus === "Shipped") {
//       const tokenValid = await ShiprocketToken.find();
//       console.log("Mil kya kya rha hai", tokenValid);

//       const added_on = tokenValid[0].added_on;
//       const current_time = Date.now();
//       const added_on_timestamp = new Date(added_on).getTime();
//       const diff_time = (current_time - added_on_timestamp) / 1000;
//       console.log("Time Different Kya hai (in seconds)", diff_time);

//       let AddShiprocketInfo;
//       if (diff_time > 0) {
//         const token = await generateShipRocketToken();
//         console.log("Token mila kya", token);
//         const shippingDetails = await ShippingDetails.findOne({ 'orderItem': { $in: req.params.id } }).populate(["orderItem", "UserID"]);

//         AddShiprocketInfo = await PlaceAndConfirmCustomerOrder({ token: token, order_id: req.params.id, length: shippingDetails.length, height: shippingDetails.heigth, weight: shippingDetails.weight, breadth: shippingDetails.baseModelName })
//       }
//       else {
//         const token = tokenValid[0].token
//         const shippingDetails = await ShippingDetails.findOne({ 'orderItem': { $in: req.params.id } }).populate(["orderItem", "UserID"]);

//         AddShiprocketInfo = await PlaceAndConfirmCustomerOrder({ token: token, order_id: req.params.id, length: shippingDetails.length, height: shippingDetails.heigth, weight: shippingDetails.weight, breadth: shippingDetails.baseModelName })
//       }



//       console.log("Shiprocket ka response kya hau", AddShiprocketInfo)

//       shippingDetails.shiprocket_order_id = AddShiprocketInfo.order_id || AddShiprocketInfo.channel_order_id
//       shippingDetails.shiprocket_shipment_id = AddShiprocketInfo.shipment_id || AddShiprocketInfo.channel_order_id
//       await shippingDetails.save();

//     }
//   } catch (error) {
//     console.log(error);
//   }

//   res.status(200).json({
//     success: true,
//     message: "Shipping details and order status updated successfully",
//     shippingDetails
//   });
// });


// const generateShipRocketToken = async () => {
//   const email = "dileepsahu0873@gmail.com";
//   const password = "Dileep@0873";

//   // Fetch the current Shiprocket token data
//   const updateData = await ShiprocketToken.find();

//   // Make the request to Shiprocket API
//   const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', { email, password });
//   console.log("Shiprocket response: ", response.data);

//   // Update the first document in updateData with the new token and timestamp
//   const tokenData = updateData[0];
//   tokenData.added_on = Date.now();
//   tokenData.token = response.data.token;

//   // Save the updated document
//   await tokenData.save();

//   // Return the new token
//   return response.data.token;
// }


// const PlaceAndConfirmCustomerOrder = async (param) => {
//   const { token, order_id, length, height, weight, breadth } = param;

//   if (!token) {
//     console.log("Shiprocket token not available.");
//     return;
//   }

//   // Fetch order details with user information
//   const orderDetails = await OrderItem.findById(order_id).populate("UserID");
//   if (!orderDetails) {
//     console.log("Order not found.");
//     return;
//   }

//   console.log(orderDetails)
//   const user = orderDetails.UserID;
//   const cartItems = orderDetails.cartJsonData.length > 0 ? JSON.parse(orderDetails.cartJsonData[0]) : [];

//   if (!cartItems || cartItems.length === 0) {
//     console.log("Cart items are missing.");
//     return;
//   }

//   // Assuming payment method details are fetched from PaymentMethod
//   const paymentDetails = await PaymentMethod.find({ 'displaySeqNo': { $in: [orderDetails.PaymentMethod] } });
//   const paymentMethod = paymentDetails.length > 0 ? paymentDetails[0].name : 'Unknown';

//   const params = {
//     "order_id": `order_${order_id}`,
//     "order_date": new Date().toISOString(),
//     "pickup_location": "PARIJAT HANDICRAFT",
//     "comment": "Reseller: M/s Goku",
//     "billing_customer_name": user.name,
//     "billing_last_name": user.lname,
//     "billing_address": user.address,
//     "billing_city": user.CityName,
//     "billing_pincode": user.PostalCode,
//     "billing_state": user.StateName,
//     "billing_country": user.CountryName,
//     "billing_email": user.email,
//     "billing_phone": user.phone,
//     "shipping_is_billing": true,
//     "shipping_customer_name": user.name,
//     "shipping_last_name": user.lname,
//     "shipping_address": user.address,
//     "shipping_city": user.CityName,
//     "shipping_pincode": user.PostalCode,
//     "shipping_country": user.CountryName,
//     "shipping_state": user.StateName,
//     "shipping_email": user.email,
//     "shipping_phone": user.phone,
//     "order_items": cartItems.map(item => ({
//       name: item.ProductName,
//       sku: item.ProductId,
//       units: item.Quantity,
//       selling_price: item.Price || 0,
//     })),
//     "payment_method": paymentMethod == "PayU" ? "Prepaid" : paymentMethod,
//     "sub_total": orderDetails.totalOrderPrice,
//     "total_discount": orderDetails.totalDiscount || 0,
//     "length": length || 10,
//     "breadth": breadth || 15,
//     "height": height || 20,
//     "weight": weight || 2.5,
//   };

//   // Validate required fields
//   if (!params.billing_customer_name || !params.billing_address || !params.billing_phone || !params.billing_pincode || !params.order_items) {
//     console.log("Some required billing or order item fields are missing.");
//     return;
//   }

//   try {
//     const headers = {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`,
//     };

//     console.log("Shiprocket Order Request Data: ", JSON.stringify(params, null, 2));

//     const response = await axios.post('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', params, { headers });

//     console.log("Shiprocket Order Response: ", response.data);

//     if (response.data.error) {
//       console.log("Error in Shiprocket response: ", response.data.error);
//     } else {
//       console.log("Order successfully placed with Shiprocket.");
//       return response.data
//     }

//   } catch (error) {
//     console.error("Error sending order to Shiprocket:", error);
//     if (error.response) {
//       console.error("Shiprocket API Error Response: ", error.response.data);
//     }
//   }
// };








import Order from "../models/orderModel.js";
import MenuItem from "../models/menuItemModel.js";
import Table from "../models/tableModel.js";
import Variant from "../models/varianModel.js";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

// export const placeOrder = async (req, res) => {
//     try {
//         const {
//             restaurant,
//             table,
//             orderType,
//             items,
//             discountAmount = 0
//         } = req.body;

//         if (!restaurant || !orderType || !items?.length) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid order data"
//             });
//         }

//         let subTotal = 0;

//         const formattedItems = [];

//         for (const cartItem of items) {
//             const dbItem = await MenuItem.findById(cartItem.itemId);

//             if (!dbItem) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Menu item not found"
//                 });
//             }

//             const basePrice = dbItem.price;

//             let itemTotal = 0;

//             const formattedVariants = cartItem.variants?.map(v => {
//                 const variantTotal = (v.price || 0) * (v.quantity || 1);
//                 itemTotal += variantTotal;

//                 return {
//                     variantId: v.variantId,
//                     name: v.name,
//                     price: v.price,
//                     quantity: v.quantity
//                 };
//             }) || [];

//             itemTotal += basePrice * cartItem.quantity;

//             subTotal += itemTotal;

//             formattedItems.push({
//                 itemId: dbItem._id,
//                 name: dbItem.name,
//                 basePrice,
//                 variants: formattedVariants,
//                 quantity: cartItem.quantity,
//                 totalPrice: itemTotal
//             });
//         }

//         const taxAmount = subTotal * 0.05; // 5% tax example
//         const grandTotal = subTotal + taxAmount - discountAmount;

//         const order = await Order.create({
//             restaurant,
//             table,
//             orderType,
//             createdBy: req.user._id,
//             items: formattedItems,
//             subTotal,
//             taxAmount,
//             discountAmount,
//             grandTotal
//         });

//         // ✅ DINE_IN me table occupied karo
//         if (orderType === "DINE_IN" && table) {
//             await Table.findByIdAndUpdate(table, { status: "occupied" });
//         }

//         res.status(201).json({
//             success: true,
//             message: "Order placed successfully",
//             order
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };







export const placeOrder = async (req, res) => {
    try {
        const {
            restaurant,
            table,
            items,
            orderType,
            subTotal,
            taxAmount,
            grandTotal
        } = req.body;

        const existingToken = req.cookies?.orderToken;

        if (!restaurant || !items?.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid order data"
            });
        }

        /* ===================================================
           🔎 FORMAT ITEMS FROM DATABASE (IMPORTANT FIX)
        ==================================================== */

        const formattedItems = [];

        for (const cartItem of items) {

            const dbItem = await MenuItem.findById(cartItem.itemId);

            if (!dbItem) continue;

            const formattedVariants = [];

            if (cartItem.variants?.length) {
                for (const v of cartItem.variants) {

                    const dbVariant = await Variant.findById(v.variantId);
                    if (!dbVariant) continue;

                    formattedVariants.push({
                        variantId: dbVariant._id,
                        name: dbVariant.name,
                        price: dbVariant.price,
                        quantity: v.quantity || 1
                    });
                }
            }

            formattedItems.push({
                itemId: dbItem._id,
                name: dbItem.name,
                image: dbItem.image || [],  // ✅ IMAGE FIXED
                basePrice: dbItem.basePrice,
                quantity: cartItem.quantity || 1,
                variants: formattedVariants,
                totalPrice: cartItem.totalPrice || 0
            });
        }

        /* ===================================================
           🔁 CHECK EXISTING ORDER BY TOKEN
        ==================================================== */

        let order = null;

        if (existingToken) {
            order = await Order.findOne({
                orderAccessToken: existingToken,
                orderStatus: { $nin: ["COMPLETED", "CANCELLED"] }
            });
        }

        /* ===================================================
           🔄 UPDATE EXISTING ORDER
        ==================================================== */


        console.log("Bhai mere Order Kya aa rha hai", order)
        console.log("Bhai mere formattedItems Kya aa rha hai", formattedItems)

        if (order) {

            for (const newItem of formattedItems) {

                const existingIndex = order.items.findIndex(
                    (i) =>
                        i.itemId.toString() === newItem.itemId.toString() &&
                        JSON.stringify(i.variants || []) ===
                        JSON.stringify(newItem.variants || [])
                );

                if (existingIndex > -1) {
                    order.items[existingIndex].quantity += newItem.quantity;
                    // order.items[existingIndex].grandTotal += grandTotal;
                    // order.items[existingIndex].subTotal += subTotal;
                } else {
                    order.items.push(newItem);
                }
            }

            order.subTotal += Number(subTotal);
            order.taxAmount += Number(taxAmount);
            order.grandTotal += Number(grandTotal);

            await order.save();

            return res.status(200).json({
                success: true,
                message: "Order updated successfully",
                order
            });
        }

        /* ===================================================
           🆕 CREATE NEW ORDER
        ==================================================== */

        const lastOrder = await Order.findOne().sort({ createdAt: -1 });

        let nextNumber = 1;

        if (lastOrder?.orderNumber) {
            const lastNum = parseInt(
                lastOrder.orderNumber.replace("#ORDER", "")
            );
            nextNumber = lastNum + 1;
        }

        const orderNumber = `#ORDER${String(nextNumber).padStart(4, "0")}`;

        const orderAccessToken = crypto.randomBytes(32).toString("hex");

        const newOrder = await Order.create({
            orderNumber,
            restaurant,
            table: table || null,
            orderType: orderType || "DINE_IN",
            items: formattedItems,
            subTotal: Number(subTotal),
            taxAmount: Number(taxAmount),
            grandTotal: Number(grandTotal),
            orderAccessToken
        });

        if (table) {
            await Table.findByIdAndUpdate(table, { status: "occupied" });
        }

        res.cookie("orderToken", orderAccessToken, {
            sameSite: "none",
            secure: true,

            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 3
        });

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: newOrder
        });

    } catch (error) {
        console.error("Place Order Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};





export const getOrders = async (req, res) => {
    try {
        const {
            restaurant,
            status,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {};

        if (restaurant) filter.restaurant = restaurant;
        if (status) filter.orderStatus = status;

        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(filter)
            .populate("table", "tableNumber status")
            .populate("createdBy", "name email")
            .populate("restaurant", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(filter);

        return res.json({
            success: true,
            totalOrders: total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
            orders
        });

    } catch (error) {
        console.error("Get Orders Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "NEW",
            "PREPARING",
            "READY",
            "SERVED",
            "COMPLETED",
            "CANCELLED"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = status;
        await order.save();

        /* ===== TABLE FREE LOGIC ===== */
        if (
            (status === "COMPLETED" || status === "CANCELLED") &&
            order.table
        ) {
            await Table.findByIdAndUpdate(order.table, {
                status: "free"
            });
        }

        return res.json({
            success: true,
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("Update Order Status Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};



export const getMyOrder = async (req, res) => {
    try {
        const token = req.cookies.orderToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No order access"
            });
        }

        const order = await Order.findOne({ orderAccessToken: token })
            .populate("table").populate("restaurant", "name logo");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// controllers/invoiceController.js

import puppeteer from "puppeteer";



export const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("restaurant")
            .populate("table");

        console.log("Bhai mere ek baar batao  ki ORder kya tha", order)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const itemsHTML = order.items.map((item, index) => {

            const basePrice = item.basePrice;
            const totalQuantity = item.variants?.reduce((acc, v) => {
                return acc + (Number(v.quantity) || 0);
            }, 0) || 0;

            const variantsHTML = item.variants?.map(v =>
                `
        <div class="row small">
          <div class="indent">
            ↳ ${v.name} (x${v.quantity})
          </div>
          <div>
            ₹${(v.price * v.quantity).toFixed(2)}
          </div>
        </div>
      `).join("") || "";

            return `
        <div class="item-name">${index + 1}. ${item.name}</div>

        <div class="row small">
          <div>${ totalQuantity?totalQuantity:item.quantity} x ₹${basePrice.toFixed(2)}</div>
          <div>₹${totalQuantity?(totalQuantity*basePrice).toFixed(2):item.totalPrice.toFixed(2) }</div>
        </div>

        ${variantsHTML}

        <div class="divider"></div>
      `;
        }).join("");

        const html = `
<html>
<head>
  <style>
    body {
      font-family: monospace;
      background: #fff;
      margin: 0;
      padding: 10px;
    }

    .invoice {
      width: 300px;
      margin: auto;
      font-size: 12px;
      color: #000;
      line-height: 1.5;
    }

    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }

    .divider {
      border-top: 1px dashed #000;
      margin: 6px 0;
    }

    .row {
      display: flex;
      justify-content: space-between;
    }

    .item-name {
      margin-top: 6px;
      font-weight: bold;
    }

    .small {
      font-size: 11px;
    }

    .total {
      font-weight: bold;
      font-size: 14px;
    }

    .indent {
      padding-left: 10px;
    }

  </style>
</head>

<body>

<div class="invoice">

  <div class="center bold">
    ${order.restaurant?.name}
  </div>

  <div class="center small">
    ${order.restaurant?.address || ""}
  </div>

  <div class="center small">
    GSTIN: ${order.restaurant?.gstNumber || "-"}
  </div>

  <div class="divider"></div>

  <div class="center bold">TAX INVOICE</div>

  <div class="divider"></div>

  <div class="row">
    <div>Invoice #:</div>
    <div>${order.orderNumber}</div>
  </div>

  <div class="row">
    <div>Date:</div>
    <div>${new Date(order.createdAt).toLocaleDateString()}</div>
  </div>

  <div class="divider"></div>

  <div class="bold">BILLED TO</div>
  <div>${order.customer?.name || "Walk-in Customer"}</div>
  <div class="small">${order.customer?.phone || ""}</div>

  <div class="divider"></div>

  ${itemsHTML}

  <div class="bold center">SUMMARY</div>

  <div class="divider"></div>

  <div class="row">
    <div>Taxable Amount</div>
    <div>₹${order.subTotal?.toFixed(2)}</div>
  </div>

  <div class="row">
    <div>Add: GST</div>
    <div>₹${order.taxAmount?.toFixed(2) || "0.00"}</div>
  </div>

  <div class="divider"></div>

  <div class="row total">
    <div>Grand Total</div>
    <div>₹${order.grandTotal?.toFixed(2)}</div>
  </div>

  <div class="divider"></div>

  <div class="center small">
    Thank You For Your Business<br/>
    Visit Again 🙏
  </div>

</div>

</body>
</html>
`;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: "domcontentloaded" });

        const pdf = await page.pdf({
            width: "80mm",
            printBackground: true
        });

        await browser.close();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=Invoice-${order.orderNumber}.pdf`
        });

        res.send(pdf);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invoice generation failed" });
    }
};
