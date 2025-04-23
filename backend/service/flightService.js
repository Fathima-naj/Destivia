import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import Flight from "../model/flightModel.js"

export const getAirportCodesFromMunicipality = async (municipalityName) => {
  try {
    const response = await axios.get(
      `https://aerodatabox.p.rapidapi.com/airports/search/term?q=${municipalityName}`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.RAPID_APIS_KEY,
          "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
        },
      }
    );

    console.log(`Airport search response for "${municipalityName}":`, response.data);

    const airports = response.data.items;
    if (!airports || airports.length === 0) return null;

    const matchedAirport =
      airports.find((airport) =>
        airport.municipalityName?.toLowerCase() === municipalityName.toLowerCase()
      ) || airports[0];

    return {
      iata: matchedAirport.iata,
      fullName: matchedAirport.name,
    };
  } catch (error) {
    console.error("Error fetching airport codes:", error.message);
    throw new Error(error)
  }
};

export const fetchFlights = async ({ from, to, date, passengers = 1, classType = "economy" }) => {
  try {
    const tripClassMap = {
      economy: 0,
      business: 1,
      first: 2,
    };

    const response = await axios.get("https://api.travelpayouts.com/aviasales/v3/prices_for_dates", {
      params: {
        origin: from,
        destination: to,
        departure_at: date,
        currency: "USD",
        trip_class: tripClassMap[classType.toLowerCase()] ?? 0,
        limit: 10,
        token: process.env.TRAVELPAYOUTS_TOKEN,
      },
    });

    const flights = response.data?.data || [];

    console.log('response of flight',flights);
    const getRandomValue = (classType) => {
      const ranges = {
        economy: [50, 100],
        business: [10,20],
        first: [5,10]
      };
    
      const [min, max] = ranges[classType] || [1, 10];
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    
    
    const savedFlights = await Promise.all(
      flights.map(async (flight) => {
        const flightData = {
          flightNumber: flight.flight_number || "N/A",
          airline: flight.airline || "Unknown",
          departureAt: flight.departure_at || "N/A",
          duration: flight.duration || "N/A",
          price: `${flight.price} USD`,
          transfers: flight.transfers ?? 0,
          class: classType,
          passengers,
          logo: flight.airline
            ? `https://pics.avs.io/100/100/${flight.airline}.png`
            : "https://via.placeholder.com/100?text=N/A",
          origin: from,
          destination: to,
          searchDate: date,
          seatsAvailable:getRandomValue(classType),
          seatsBooked:0,
        };

        return await Flight.create(flightData);
      })
    );

    return savedFlights;
  } catch (error) {
    console.error("Travelpayouts API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch flight data");
  }
};

export const bookFlight = async (flightId, passengers) => {
  const flight = await Flight.findById(flightId);
  if (!flight) {
    throw new Error("Flight not found");
  }

  if (flight.seatsAvailable < passengers) {
    throw new Error("Not enough seats available for this flight");
  }

  flight.seatsBooked += passengers;
  flight.seatsAvailable -= passengers;

  await flight.save();

  return flight;
};
