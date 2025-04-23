import axios from "axios";
import Hotel from "../model/hotelModel.js"; 
import dotenv from "dotenv";
dotenv.config();

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

const cleanHotelName = (name) => {
  return name
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9\s]/g, "")  
    .replace(/\s+/g, " ")            
    .trim();
};

export const getHotelImages = async (hotel) => {
  try {
    if (!hotel || !hotel.hotelName) {
      console.warn("Invalid hotel data:", hotel);
      return ["https://via.placeholder.com/400x300?text=Invalid+Hotel"];
    }

    const { hotelId, hotelName } = hotel;

    const existing = await Hotel.findOne({ hotelId });
    if (existing && existing.images?.length) {
      return existing.images;
    }

    const cleanedName = cleanHotelName(hotelName);
    const query = `view of ${cleanedName} hotel`;

    const response = await axios.get("https://pixabay.com/api/", {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        image_type: "photo",
        category: "places",
        per_page: 5,
        safesearch: true,
      },
    });

    const hits = response.data?.hits;
    const imageUrls = hits?.length > 0
      ? hits.map(hit => hit.webformatURL)
      : ["https://via.placeholder.com/400x300?text=No+Image"];

    if (existing) {
      existing.images = imageUrls;
      await existing.save();
    } else {
      console.warn("Hotel doesn't exist yet, skipping image save.");
    }

    return imageUrls;

  } catch (error) {
    console.error("Pixabay error:", error.message);
    return ["https://via.placeholder.com/400x300?text=No+Image"];
  }
};
