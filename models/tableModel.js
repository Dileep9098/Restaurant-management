import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },

    tableNumber: {
      type: String,
      required: true,
      trim: true
    },

    capacity: {
      type: Number,
      default: 2
    },

    status: {
      type: String,
      enum: ["free", "occupied", "reserved"],
      default: "free"
    },

    qrCodeUrl: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

/* ek restaurant me same table number repeat na ho */
tableSchema.index({ restaurant: 1, tableNumber: 1 }, { unique: true });

export default mongoose.model("Table", tableSchema);
