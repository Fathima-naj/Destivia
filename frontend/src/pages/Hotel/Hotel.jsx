import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHotels } from '../../slice/hotelSlice';
import Pagebar from '../../components/pagebar';
import { useNavigate } from "react-router-dom";
import HotelInput from './HotelInput';
import HotelSearchResult from './HotelSearchResult';

const Hotel = () => {
  const dispatch = useDispatch();
  const { hotels, loading } = useSelector((state) => state.hotels);
  console.log('frontend hotels',hotels,typeof hotels);
  
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [guest, setGuests] = useState(1);
  const [dropdown, setDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    dispatch(fetchHotels({ location, checkIn, checkOut, adults:guest}));
  };

  const handleBookNow = (hotel) => {
    console.log("hotel id",hotel.hotelId)
    navigate(`/hotels/${hotel.hotelId}`,{
      state: {
        checkIn: checkIn,
        checkOut: checkOut,
        adults:adults,
        children:children
      }
    })
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative bg-[url('./assets/hotel.jpg')] bg-cover bg-center h-[300px] sm:h-[400px]">
        <div className="absolute inset-0 "></div>
        
         
          <div className="flex flex-col  py-20 items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-3xl sm:text-5xl font-bold">Find the perfect stay</h1>
            <p className="text-sm sm:text-lg mt-2">Hotels, resorts, and more — explore top destinations</p>
          </div>
        
      </div>

     
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
        <HotelInput 
        location={location}
        checkIn={checkIn}
        checkOut={checkOut}
        adults={adults}
        children={children}
        guest={guest}
        dropdown={dropdown}
        setCheckIn={setCheckIn}
        setCheckOut={setCheckOut}
        setLocation={setLocation}
        setAdults={setAdults}
        setChildren={setChildren}
        setGuests={setGuests}
        setDropdown={setDropdown}
        handleSearch={handleSearch}
        />
      </div>

      
      <div className="max-w-6xl mx-auto px-4 py-10">
        {hotels.length === 0 && !loading ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Explore Top Destinations</h2>
            <p className="text-center text-gray-500 mb-6">Find your perfect stay from popular places around the world</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: 'Paris', image: './assets/paris.jpg' },
                { name: 'New York', image: './assets/ny.jpg' },
                { name: 'Dubai', image: './assets/dubai.jpg' },
                { name: 'Tokyo', image: './assets/tokyo.jpg' },
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                  <img src={item.image} alt={item.name} className="h-40 w-full cursor-pointer object-cover" />
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Discover hotels in {item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
          <HotelSearchResult
          hotels={hotels}
          loading={loading}
          handleBookNow={handleBookNow}
          />
          </>
        )}
      </div>
    </div>
  );
};

export default Hotel;
