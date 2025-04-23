import React, { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const FlightSearchForm = ({
  departure,
  arrival,
  date,
  adults,
  children,
  passengers,
  classType,
  showPassengerDropdown,
  setDeparture,
  setArrival,
  setDate,
  setAdults,
  setChildren,
  setPassengers,
  setClassType,
  setShowPassengerDropdown,
  handleSearch,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPassengerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-wrap gap-4 justify-center items-center">
      <input
        type="text"
        placeholder="From (City)"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        className="border border-gray-300 p-2 rounded-md w-44 sm:w-48 focus:outline-blue-500"
      />
      <input
        type="text"
        placeholder="To (City)"
        value={arrival}
        onChange={(e) => setArrival(e.target.value)}
        className="border border-gray-300 p-2 rounded-md w-44 sm:w-48 focus:outline-blue-500"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
        className="border border-gray-300 p-2 rounded-md w-36 focus:outline-blue-500"
      />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
          className="border border-gray-300 p-2 flex justify-between rounded-md w-48 text-left items-center gap-1 focus:outline-blue-500"
        >
          {adults} Adult{adults > 1 ? "s" : ""}, {children} Child{children > 1 ? "ren" : ""}
          <ChevronDown className="w-4 h-4" />
        </button>

        {showPassengerDropdown && (
          <div className="absolute z-20 mt-2 w-52 rounded-xl shadow-lg bg-white p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Adults</span>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 font-bold w-8 bg-red-500 text-white rounded-xl disabled:opacity-50"
                  disabled={adults <= 1}
                  onClick={() => setAdults(adults - 1)}
                >
                  -
                </button>
                <span>{adults}</span>
                <button
                  className="px-3 py-1 w-8 bg-blue-500 text-white rounded-xl"
                  onClick={() => setAdults(adults + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Children</span>
              <div className="flex items-center space-x-2">
                <button
                  className="px-3 py-1 font-bold w-8 bg-red-500 text-white rounded-xl disabled:opacity-50"
                  disabled={children <= 0}
                  onClick={() => setChildren(children - 1)}
                >
                  -
                </button>
                <span>{children}</span>
                <button
                  className="px-3 py-1 w-8 bg-blue-500 text-white rounded-xl"
                  onClick={() => setChildren(children + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                className="text-blue-500 hover:underline text-sm"
                onClick={() => {
                  setPassengers(adults + children);
                  setShowPassengerDropdown(false);
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      <select
        value={classType}
        onChange={(e) => setClassType(e.target.value)}
        className="border border-gray-300 p-2 rounded-md w-36 focus:outline-blue-500"
      >
        <option value="economy">Economy</option>
        <option value="business">Business</option>
        <option value="first">First</option>
      </select>

      <button
        onClick={handleSearch}
        className="bg-yellow-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Search
      </button>
    </div>
  );
};

export default FlightSearchForm;
