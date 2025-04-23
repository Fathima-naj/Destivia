import axios from "axios";
import dotenv from "dotenv";
import Hotel from "../model/hotelModel.js"; 
dotenv.config();

const travelpayoutsToken = process.env.TRAVELPAYOUTS_TOKEN;

export const fetchHotelDetails = async ({
  location,
  checkIn,
  checkOut,
  limit = 10,
  adults = 2,
}) => {
  try {
    const response = await axios.get("https://engine.hotellook.com/api/v2/cache.json", {
      params: {
        location,
        limit,
        adults,
        checkIn,
        checkOut,
        currency: "usd",
        token: travelpayoutsToken,
      },
    });
    console.log("hotels.......", response.data);
   
    return response.data
    
    .map(hotel => ({
      hotelId: hotel.hotelId,
      hotelName: hotel.hotelName,
      location: {
        name: hotel.location.name,
        country: hotel.location.country,
      },
      stars: hotel.stars || 0,
      priceFrom: hotel.priceFrom || 0,
      priceAvg: hotel.priceAvg || 0,
      percentilePrices: hotel.pricePercentile || {},
      images: [],
      rooms: [],

    }));
  
  } catch (err) {
    console.error("API call error:", err.response?.data || err.message);
    throw err;
  }
};

export const getHotelById = async (id) => {
  const hotel = await Hotel.findById(id);
  if (!hotel) {
    throw new Error("Hotel not found");
  }
  return hotel;
};
