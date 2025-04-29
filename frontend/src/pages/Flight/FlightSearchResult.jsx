import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FlightSearchResults = ({ flights, loading, error, passengers }) => {
  const navigate = useNavigate();

  const [bookedFlights, setBookedFlights] = useState(new Set());

  useEffect(() => {
    const storedBookedFlights = localStorage.getItem("bookedFlights");
    const bookedFlightsArray = storedBookedFlights ? JSON.parse(storedBookedFlights) : [];
    
    setBookedFlights(new Set(bookedFlightsArray));
    console.log("Stored Booked Flights:", bookedFlightsArray);
  }, []);

  const handleBooking = (flightId) => {
    setBookedFlights((prevBookedFlights) => {
      const updatedBookedFlights = new Set(prevBookedFlights);
      updatedBookedFlights.add(flightId); 
      localStorage.setItem("bookedFlights", JSON.stringify(Array.from(updatedBookedFlights)));

      return updatedBookedFlights;
    });
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-6">
      {loading && <p className="text-blue-500">Loading flights...</p>}
      {error && <p className="text-red-500">{error.error || "Something went wrong"}</p>}

      {flights.length === 0 ? (
        <p className="text-gray-500">No flights found</p>
      ) : (
        flights.map((flight, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-100"
          >
            <div className="flex items-center gap-6 w-full sm:w-2/3">
              <img
                src={flight.logo}
                alt={flight.airline}
                className="w-14 h-14 object-contain rounded-md border border-gray-300"
              />
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  {flight.airline} · #{flight.flightNumber}
                </p>
                <p className="text-lg text-gray-600 font-medium">
                  {flight.origin} ➝ {flight.destination}
                </p>
                <p className="text-sm text-gray-500">
                  🕑 {new Date(flight.departureAt).toLocaleTimeString()} · {flight.duration} min
                </p>
                <p className="text-sm text-gray-500">
                  Class: <span className="capitalize font-medium">{flight.class}</span>
                </p>
              </div>
            </div>

            <div className="text-right space-y-1 w-full sm:w-1/3 mt-4 sm:mt-0">
              <p className="text-sm text-gray-600">Passengers: {flight.passengers}</p>
              <p className="text-green-600 font-bold text-xl">
                ₹ {((parseFloat(flight.price) * parseInt(flight.passengers)) * 85)}
              </p>

              {bookedFlights.has(flight._id) ? (  
                <button  
                  disabled
                  className="bg-yellow-700/50 text-white px-6 py-2 rounded-lg shadow-md text-sm md:text-base cursor-not-allowed"
                >
                   Booked
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleBooking(flight._id); 
                    navigate("/f-booking", {
                      state: {
                        flight: flight,
                        passengers: passengers,
                      },
                    });
                  }}
                  className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 text-white px-6 py-2 rounded-lg shadow-md text-sm md:text-base transition duration-200"
                >
                  Book Now
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FlightSearchResults;
