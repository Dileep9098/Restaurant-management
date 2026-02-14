// // models/Notification.js

// import mongoose from "mongoose";
// const notificationSchema = new mongoose.Schema({
//     UserID: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     type: { type: String, enum: ['WALLET', 'ORDER', 'OTHER'], default: 'OTHER' },

//     isRead: {
//         type: Boolean,
//         default: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const Notification = mongoose.model("Notification", notificationSchema);
// export default Notification;

// models/Notification.js

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['WALLET', 'ORDER', 'KYC','OTHER'],
        default: 'OTHER'
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;



