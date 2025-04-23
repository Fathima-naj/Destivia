import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularFlights } from "../slice/popularSlice";
import FlightBookingForm from "./Flight/FlightBooking";
import { useNavigate } from "react-router-dom";
const PopularFlightSuggestions = () => {
  const dispatch = useDispatch();
  const [showBookingForm,setShowBookingForm]=useState(false)
   const [passengers, setPassengers] = useState(1);
  const { flight, error, loading } = useSelector((state) => state.popular);
  const navigate=useNavigate()
  useEffect(() => {
    dispatch(fetchPopularFlights());
  }, [dispatch]);

  if (loading) return <p>Loading suggestions...</p>;
  if (error) return <p className="text-red-500">Failed to load popular flights</p>;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-4">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {flight.map((flight, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-5 border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-3">
              <img
                src={flight.logo}
                alt={flight.airline}
                className="w-12 h-12 object-contain rounded-md border border-gray-300"
              />
              <div>
                <p className="font-semibold text-gray-800">
                  {flight.airline} · #{flight.flightNumber}
                </p>
                <p className="text-sm text-gray-500">
                  {flight.origin} ➝ {flight.destination}
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              🕒 {flight.duration} min |{" "}
              <span className="capitalize font-medium">{flight.class}</span>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-green-600 font-bold text-lg">
                ${(parseFloat(flight.price) * parseInt(flight.passengers))*85.38}
              </p>
              <button 
              onClick={() => navigate('/f-booking',{state:{
                flight:flight,
                passengers:passengers
              }})}
               className="bg-yellow-500 cursor-pointer hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md text-sm md:text-base transition duration-200"
              >Book now</button>

             
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularFlightSuggestions;
