import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlights } from "../../slice/flightSlice";
import Pagebar from "../../components/pagebar";
import { ChevronDown } from "lucide-react";
import PopularFlightSuggestions from "../PopularFlight";
import FlightBookingForm from "./FlightBooking";
import FlightSearchForm from "./FlightInput";
import FlightSearchResults from "./FlightSearchResult";
const FlightSearchList = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [classType, setClassType] = useState("economy");
  const hasSearched = departure && arrival && date;
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  
  const dispatch = useDispatch();
  const { flights, loading, error } = useSelector((state) => state.flights);

  const handleSearch = () => {
    if (!departure || !arrival || !date) {
      alert("Please enter all required fields!");
      return;
    }

    dispatch(fetchFlights({ from: departure, to: arrival, date, passengers, classType }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative bg-[url('./assets/flight.jpg')] bg-cover bg-center  h-[300px] sm:h-[400px]">
        <div className=" inset-0 bg-black/30"></div>
        <div className="absolute ">
          
          <div className="flex flex-col  py-20 items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-3xl sm:text-5xl font-bold">Not sure where to go ?</h1>
            <p className="text-sm sm:text-lg mt-2"> Explore popular flights loved by travelers!</p>
          </div>
          <div className="max-w-5xl mx-auto px-4">
         
            
            <FlightSearchForm
          departure={departure}
          arrival={arrival}
          date={date}
          adults={adults}
          children={children}
          passengers={passengers}
          classType={classType}
          showPassengerDropdown={showPassengerDropdown}
          setDeparture={setDeparture}
          setArrival={setArrival}
          setDate={setDate}
          setAdults={setAdults}
          setChildren={setChildren}
          setPassengers={setPassengers}
          setClassType={setClassType}
          setShowPassengerDropdown={setShowPassengerDropdown}
          handleSearch={handleSearch}
        />

          </div>
        </div>
      </div>

      <div className="w-full px-4 py-32">
        
        {!hasSearched?(
          <>
          <h3 className="text-2xl font-semibold text-gray-800 mx-56 mb-6">🌍 Popular Flight Routes</h3>
          <PopularFlightSuggestions/>
          </>
        ):(
          <>
          <h2 className="text-2xl font-bold mb-6 mx-65 text-gray-700">Available Flights</h2>
          <FlightSearchResults
              flights={flights}
              loading={loading}
              error={error}
              passengers={passengers}
              showBookingForm={showBookingForm}
              setShowBookingForm={setShowBookingForm}
            />
          </>
        )}
            
          </div>

      
      </div>
  
  );
};

export default FlightSearchList;
