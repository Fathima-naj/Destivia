import React, { useState } from "react";
import FlightSearchForm from "../Flight/FlightInput";
import FlightSearchResults from "../Flight/FlightSearchResult";
import { useDispatch, useSelector } from "react-redux";
import { fetchFlights } from "../../slice/flightSlice";
import HotelInput from "../Hotel/HotelInput";
import { useNavigate } from "react-router-dom";
import { fetchHotels } from "../../slice/hotelSlice";
import PlaceInput from "../Place/PlaceInput";
import { fetchPlaces } from "../../slice/placeSlice";
import HotelSearchResult from "../Hotel/HotelSearchResult";
import PlaceSearchResults from "../Place/PlaceSearchResults";
import { RiHotelFill } from "react-icons/ri";
import { GiCommercialAirplane } from "react-icons/gi";
import { FerrisWheel } from "lucide-react";

import { setActiveTab } from '../../slice/uiSlice';

function Input({ showResultsInHero = false }) {
  const [activeTab, setActiveTab] = useState("hotels");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [passengers, setPassengers] = useState(1);
  const [classType, setClassType] = useState("economy");
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guest, setGuests] = useState(1);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { flights, loading, error } = useSelector((state) => state.flights);
  const { hotels, loading: hotelLoading } = useSelector((state) => state.hotels);
  const { places, status } = useSelector((state) => state.place);

  const handleSearch = () => {
    if (activeTab === "flights") {
      if (!departure || !arrival || !date) {
        alert("Please enter all required fields!");
        return;
      }
      dispatch(fetchFlights({ from: departure, to: arrival, date, passengers, classType }));
    } 
    else if (activeTab === "hotels") {
      if (!location || !checkIn || !checkOut || !guest) {
        alert("Please fill in all fields for hotel search!");
        return;
      }
      dispatch(fetchHotels({ location, checkIn, checkOut, adults: guest }));
    } 
    else if (activeTab === "attractions") {
      if (!city && !query) {
        alert("Enter at least a city or place name");
        return;
      }
      dispatch(fetchPlaces({ city, query }));
    }
    setHasSearched(true);
  };

  const handleBookNow = (hotel) => {
    console.log("hotel id", hotel.hotelId);
    navigate(`/hotels/${hotel.hotelId}`, {
      state: {
        checkIn: checkIn,
        checkOut: checkOut,
        adults: adults,
        children: children
      }
    });
  };

  // Define search props for each form type
  const flightSearchProps = {
    departure,
    setDeparture,
    arrival,
    setArrival,
    date,
    setDate,
    passengers,
    setPassengers,
    classType,
    setClassType,
    adults,
    setAdults,
    children,
    setChildren,
    showPassengerDropdown,
    setShowPassengerDropdown
  };

  const hotelSearchProps = {
    location,
    setLocation,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
    guest,
    setGuests,
    dropdown,
    setDropdown
  };

  const placeSearchProps = {
    city,
    setCity,
    query,
    setQuery
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tabs */}
      <nav className="flex gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-t-lg text-gray-600">
        <button
          onClick={() => setActiveTab("hotels")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === "hotels"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          <RiHotelFill size={24} />
          Hotels
        </button>
        
        <button
          onClick={() => setActiveTab("flights")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === "flights"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          <GiCommercialAirplane size={23} />
          Flights
        </button>

        <button
          onClick={() => setActiveTab("attractions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeTab === "attractions"
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-100"
          }`}
        >
          <FerrisWheel size={24} />
          Attractions
        </button>
      </nav>

      {/* Search Forms */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-b-lg shadow-lg">
        {activeTab === "flights" && (
          <FlightSearchForm
            {...flightSearchProps}
            handleSearch={handleSearch}
          />
        )}

        {activeTab === "hotels" && (
          <HotelInput
            {...hotelSearchProps}
            handleSearch={() => {
              dispatch(fetchHotels({ location, checkIn, checkOut, adults: guest }));
            }}
          />
        )}

        {activeTab === "attractions" && (
          <PlaceInput
            {...placeSearchProps}
            handleSearch={() => {
              if (!city && !query) return alert("Enter at least a city or place name");
              dispatch(fetchPlaces({ city, query }));
            }}
          />
        )}
      </div>

      {/* Only show results here if showResultsInHero is true */}
      {showResultsInHero && (
        <div className="mt-8">
          {activeTab === "flights" && (
            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for flights...</p>
                </div>
              ) : flights?.length > 0 ? (
                <FlightSearchResults
                  flights={flights}
                  passengers={passengers}
                  showBookingForm={showBookingForm}
                  setShowBookingForm={setShowBookingForm}
                />
              ) : hasSearched && (
                <div className="text-center py-8 text-gray-600">
                  No flights found. Try different search criteria.
                </div>
              )}
            </div>
          )}

          {activeTab === "hotels" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelLoading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for hotels...</p>
                </div>
              ) : hotels?.length > 0 ? (
                <HotelSearchResult
                  hotels={hotels}
                  handleBookNow={handleBookNow}
                />
              ) : null}
            </div>
          )}

          {activeTab === "attractions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {status === 'loading' ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for attractions...</p>
                </div>
              ) : places?.length > 0 ? (
                <PlaceSearchResults places={places} />
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Input;
