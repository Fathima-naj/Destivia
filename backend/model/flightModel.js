
import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flightNumber: String,
  airline: String,
  departureAt: String,
  duration: String,
  price: String,
  transfers: Number,
  class: String,
  passengers: Number,
  logo: String,
  origin: String,
  destination: String,
  searchDate: String, 
  seatsAvailable: {
    type: Number,
    required: true,
    min: 0
  }, 
  seatsBooked: {
    type: Number,
    default: 0
  } 
}, { timestamps: true });

export default mongoose.model("Flight", flightSchema);
