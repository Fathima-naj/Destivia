import axios from 'axios';
import {
  getOrFetchPlace,
} from '../service/placeService.js';

export const searchPlaceByCity = async (req, res) => {
  const { city, query } = req.query;

  try {
    let url = 'https://api.foursquare.com/v3/places/search?limit=5';
    if (query) url += `&query=${encodeURIComponent(query)}`;
    if (city) url += `&near=${encodeURIComponent(city)}`;

    const { data } = await axios.get(url, {
      headers: { Authorization: process.env.FSQ_API_KEY },
    });

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ message: 'No places found' });
    }

    const places = await Promise.all(
      data.results.map(async (result) => await getOrFetchPlace(result.fsq_id))
    );

    res.status(200).json(places);
  } catch (err) {
    console.error("[Place Search Error]", err.message);
    res.status(500).json({ message: err.message });
  }
};

export const getPlaceById = async (req, res) => {
  const { id } = req.params;

  try {
    const place = await getOrFetchPlace(id); 
    res.status(200).json(place);
  } catch (err) {
    console.error('[Get Place Error]', err.message);
    res.status(500).json({ message: 'Failed to fetch place' });
  }
};
