// controllers/notificationController.js


// export const getNotifications = async (req, res) => {
//   try {
//     let notifications;

//     if (req.user.role === "admin") {
//       // Admin sees all
//       notifications = await Notification.find({})
//         .populate("UserID", "name email")
//         .sort({ createdAt: -1 });
//     } else {
//       // Vendor sees own notifications
//       notifications = await Notification.find({ UserID: req.user._id })
//         .sort({ createdAt: -1 });
//     }

//     res.status(200).json({ success: true, notifications });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


import Notification from "../models/notificationModel.js";

// import { io } from "../server.js"; 

export const getNotifications = async (req, res) => {
    try {
        let notifications;
        console.log(req.user._id)

        const filter = { receiver: req.user._id, isRead: false };


        if (req.user.role === "admin") {
            // Admin sees messages sent TO him
            //   notifications = await Notification.find({ receiver: req.user._id })
            //     .populate("sender", "name email")
            //     .sort({ createdAt: -1 });
            const notifications = await Notification.find(filter)
                .populate("sender", "name email")
                .sort({ createdAt: -1 });
            res.status(200).json({ success: true, notifications });

        } else {
            // Vendor sees messages sent TO him
            // notifications = await Notification.find({ receiver: req.user._id })
            //     .populate("sender", "name email")
            //     .sort({ createdAt: -1 });
            const notifications = await Notification.find(filter)
                .populate("sender", "name email")
                .sort({ createdAt: -1 });
            res.status(200).json({ success: true, notifications });

        }


        // res.status(200).json({ success: true, notifications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


// controllers/notificationController.js
export const markNotificationAsRead = async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, receiver: req.user._id },
            { isRead: true },
            { new: true }
        );
        if (!notif) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }
        res.status(200).json({ success: true, message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
