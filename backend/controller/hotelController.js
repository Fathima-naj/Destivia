import { fetchHotelDetails } from "../service/hotelService.js";
import { getHotelImages } from "../service/hotelImageService.js";
import Hotel from "../model/hotelModel.js";
import Hbook from '../model/hotelbookModel.js'
export const getHotels = async (req, res) => {
  try {
    const { location, limit, adults,checkIn,checkOut } = req.query;
    console.log("Fetching hotels with params:", { location, limit, adults });

    console.log("Received query params:", req.query);

    if (!location|| !checkIn || !checkOut) {
      return res.status(400).json({ error: "Missing required fields;checkIn ,checkOut,location" });
    }

    const hotels = await fetchHotelDetails({
      location,
      checkIn,
      checkOut,
      limit: limit ? parseInt(limit) : undefined,
      adults: adults ? parseInt(adults) : undefined,
    });

    if (!Array.isArray(hotels)) {
      return res.status(500).json({ error: "Invalid hotel data from API" });
    }

    const updatedHotels = [];

    for (const hotel of hotels) {
      let existingHotel = await Hotel.findOne({ hotelId: hotel.hotelId });

      if (!existingHotel) {
        console.log("Saving new hotel to DB:", hotel.hotelName);
        const rooms = [];

        // 2 Single rooms
        [101, 102].forEach(number => {
          rooms.push({
            roomType: "Single",
            price: 100,
            capacity: 1,
            amenities: ["Wi-Fi", "AC"],
            roomNumber: number,
            bookedDates: [],
          });
        });

        // 2 Double rooms
        [201, 202].forEach(number => {
          rooms.push({
            roomType: "Double",
            price: 200,
            capacity: 2,
            amenities: ["Wi-Fi", "AC", "TV"],
            roomNumber: number,
            bookedDates: [],
          });
        });

        existingHotel = await Hotel.create({
          hotelId: hotel.hotelId || "no-id",
          hotelName: hotel.hotelName,
          stars: hotel.stars,
          priceFrom: hotel.priceFrom,
          priceAvg: hotel.priceAvg,
          percentilePrices: hotel.percentilePrices,
          images: [],
          rooms,
          
        });
      }

      const imageUrls = await getHotelImages({ ...hotel,  });

      if (imageUrls && imageUrls.length > 0) {
        await Hotel.findOneAndUpdate(
          { hotelId: hotel.hotelId },
          { $set: { images: imageUrls } },
          { new: true }
        );
      }

      const updatedHotel = await Hotel.findOne({ hotelId: hotel.hotelId });

      console.log('Updated hotel with images:', updatedHotel?.hotelName);
      updatedHotels.push(updatedHotel);
    }

    return res.json(updatedHotels);
  } catch (error) {
    console.error("Error in getHotels controller:", error);
    res.status(500).json({ error: "Unable to fetch hotel data" });
  }
};


export const fetchHotelById = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findOne({ hotelId }); 
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    return res.json(hotel); 
  } catch (error) {
    console.error("Error fetching single hotel:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


