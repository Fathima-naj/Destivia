import { fetchFlights, getAirportCodesFromMunicipality } from "../service/flightService.js";
import Flight from "../model/flightModel.js";

export const getFlights = async (req, res) => {
  try {
    const { from, to, date, passengers = 1, classType = "economy" } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    console.log("Received params:", { from, to, date, passengers, classType });

    const departureCode = await getAirportCodesFromMunicipality(from);
    const arrivalCode = await getAirportCodesFromMunicipality(to);

    console.log("Resolved departureCode:", departureCode);
    console.log("Resolved arrivalCode:", arrivalCode);

    if (!departureCode?.iata || !arrivalCode?.iata) {
      return res.status(400).json({ error: "Invalid location names provided" });
    }

    const searchQuery = {
      origin: departureCode.iata,
      destination: arrivalCode.iata,
      searchDate: date,
      passengers: parseInt(passengers),
      class: classType,
    };

    const existingFlights = await Flight.find(searchQuery);

    if (existingFlights.length > 0) {
      console.log("Serving flights from MongoDB");
      return res.status(200).json(existingFlights);
    }

    
    const newFlights = await fetchFlights({
      from: departureCode.iata,
      to: arrivalCode.iata,
      date,
      passengers: parseInt(passengers),
      classType,
    });

    return res.status(200).json(newFlights);
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
  }
};
