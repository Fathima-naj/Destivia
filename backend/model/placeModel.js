
import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  fsq_id: String,
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  photos: [String],
  tips: [String],
  tickets:{type:Number,default:0},
  ticketPrice:String
});

export default mongoose.model("Place", placeSchema);