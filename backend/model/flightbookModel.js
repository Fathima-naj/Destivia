import mongoose from "mongoose";

const fbookSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    flight: [
      {
        // flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight', required: true },
        flightId:{type:String},
        airline: { type: String},
        origin: { type: String },
        destination: { type: String },
        classType: { type: String }, 
        departureDate: { type: String},
        seatsBooked: { 
          type: Number, 
          default: 0, 
          min: 0,
          required: true 
        } 
      }
    ],
    passengerCount: { type: Number, default: 1 },
    paymentMethod: { type: String, required: true },
    total: { type: String, min: 0 },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    status: {
      type: String,
      enum:["placed", "pending", "cancelled", "completed"],
      default: "pending"
    },
    razorpayPaymentStatus: {
      type: String,
      enum: ["paid", "failed", "pending", "captured", "refunded"],
      default: "pending"
    }
  }, { timestamps: true });
  


export default mongoose.model("Fbook",fbookSchema)