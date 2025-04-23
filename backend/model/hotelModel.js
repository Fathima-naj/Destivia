import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: { type: Number, required: true }, 
  roomType: { type: String, required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 2 },
  amenities: [String],
  bookedDates: [
    {
      checkIn: { type: Date },
      checkOut: { type: Date },
    }
  ]
});

const hotelSchema = new mongoose.Schema({
  hotelId: { type: String, required: true },
  hotelName: { type: String, required: true },
  location: {
    name: { type: String },
    country: { type: String },
  },
  stars: { type: Number },
  priceFrom: { type: Number },
  priceAvg: { type: Number },
  percentilePrices: { type: mongoose.Schema.Types.Mixed },
  // checkIn:{type:Date},
  // checkOut:{type:Date},
  images: [String], 
  rooms: [roomSchema], 

}, { timestamps: true });

export default mongoose.model("Hotel", hotelSchema);
