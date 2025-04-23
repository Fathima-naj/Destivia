import mongoose from "mongoose";

const hbookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  hotel: {
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    hotelName: { type: String },
    imageUrl: [String],
    location: {
      name: { type: String },
      country: { type: String },
  
    },
  },

  room: {
    roomType: { type: String }, 
    roomNumber:{type:Number},
    pricePerNight: { type: Number },
    roomsBooked: { type: Number, default: 1 },
  },

  guests: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
  },

  checkIn: { type: Date},
  checkOut: { type: Date },
  totalNights: { type: String }, 
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
  },

}, { timestamps: true });

export default mongoose.model("Hbook", hbookSchema);
