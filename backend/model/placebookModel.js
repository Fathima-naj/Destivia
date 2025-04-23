import mongoose from "mongoose";

const pbookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  place: {
    placeId: { type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    photos: { type: [String], required: true }, 
    ticketPrice: { type: String, required: true }
  },
  persons:{type:Number,default:1},
  paymentMethod: { type: String, required: true },
  total: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: {
    type: String,
    enum: ["placed", "pending", "cancelled", "completed"],
    default: "pending"
  },
  razorpayPaymentStatus: {
    type: String,
    enum: ["paid", "failed", "pending", "captured", "refunded"],
    default: "pending"
  }
}, { timestamps: true });


export default mongoose.model("Pbook",pbookSchema)