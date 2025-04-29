import React from 'react'
import { ChevronDown } from 'lucide-react';
import { FaPeopleRoof } from "react-icons/fa6";
import { MapPin } from "lucide-react"; // if you're using lucide-react

const HotelInput = ({
  location,
  checkIn,
  checkOut,
  adults,
  children,
  guest,
  dropdown,
  setLocation,
  setCheckIn,
  setCheckOut,
  setAdults,
  setChildren,
  setGuests,
  setDropdown,
  handleSearch
}) => {
  return (
    <div>
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          {/* Location */}
              
      <div className="relative">
        <label className="block text-sm mb-1 text-gray-700 font-medium">Location</label>
        <MapPin className="absolute left-3 top-2/2 transform -translate-y-3/2 text-gray-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Paris, London..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>


          {/* Check-in */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 font-medium">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm mb-1 text-gray-700 font-medium">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Guests */}
          <div className="relative">
            <label className="block text-sm mb-1 text-gray-700 font-medium">Guests</label>
            <button
              type="button"
              onClick={() => setDropdown(!dropdown)}
              className="w-full flex items-center justify-start gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white/70 text-gray-800"
            >
              <FaPeopleRoof className="text-gray-600" />
              <span>{guest} Guest</span>
              <ChevronDown className="ml-auto text-gray-500" size={16} />
            </button>

            {dropdown && (
              <div className="absolute mt-2 z-50 w-full bg-white shadow-lg rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Adults</span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-orange-500 text-white px-2 rounded disabled:opacity-50"
                      disabled={adults <= 1}
                      onClick={() => setAdults(adults - 1)}
                    >-</button>
                    <span>{adults}</span>
                    <button
                      className="bg-yellow-500 text-white px-2 rounded"
                      onClick={() => setAdults(adults + 1)}
                    >+</button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Children</span>
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-orange-500 text-white px-2 rounded disabled:opacity-50"
                      disabled={children <= 0}
                      onClick={() => setChildren(children - 1)}
                    >-</button>
                    <span>{children}</span>
                    <button
                      className="bg-yellow-500 text-white px-2 rounded"
                      onClick={() => setChildren(children + 1)}
                    >+</button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      setGuests(adults + children);
                      setDropdown(false);
                    }}
                    className="text-yellow-600 hover:underline"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition shadow-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelInput;
