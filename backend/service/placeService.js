import axios from 'axios';
import Place from "../model/placeModel.js";

const API_KEY = process.env.FSQ_API_KEY;
const BASE_URL = 'https://api.foursquare.com/v3';
const headers = { Authorization: API_KEY };

export const getPlaceByFsqId = async (fsq_id) => {
  return await Place.findOne({ fsq_id });
};

export const fetchPlaceDetails = async (fsq_id) => {
  const { data } = await axios.get(`${BASE_URL}/places/${fsq_id}`, { headers });
  return data;
};

export const fetchPhotos = async (fsq_id) => {
  const { data } = await axios.get(`${BASE_URL}/places/${fsq_id}/photos`, { headers });
  return data.map(photo => `${photo.prefix}original${photo.suffix}`);
};

export const fetchTips = async (fsq_id) => {
  const { data } = await axios.get(`${BASE_URL}/places/${fsq_id}/tips`, { headers });
  return data.map(tip => tip.text);
};

export const getRandomPrice = () => {
  const min = 100;
  const max = 1000;
  return `${Math.floor(Math.random() * (max - min + 1)) + min}`;
};

export const getRandomTicketCount = () => {
  const min = 5;
  const max = 20;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getOrFetchPlace = async (fsq_id) => {
  let place = await getPlaceByFsqId(fsq_id);

  if (!place) {
    const details = await fetchPlaceDetails(fsq_id);
    const photos = await fetchPhotos(fsq_id);
    const tips = await fetchTips(fsq_id);

    place = new Place({
      fsq_id,
      name: details.name,
      address: details.location.formatted_address,
      latitude: details.geocodes.main.latitude,
      longitude: details.geocodes.main.longitude,
      photos,
      tips,
      ticketPrice: getRandomPrice(),
      tickets:getRandomTicketCount()
    });

    await place.save();
  }

  return place;
};
