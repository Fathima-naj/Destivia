// HotelList.jsx
import React from 'react';

const HotelSearchResult = ({ hotels, loading, handleBookNow }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {loading ? (
        <div className="text-center text-gray-500">Loading hotels...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
              <img
                src={hotel.images?.[Math.floor(Math.random() * hotel.images.length)] }
                alt={hotel.hotelName}
                onClick={() => handleBookNow(hotel)}
                className="w-full h-40 object-cover rounded-t-lg hover:opacity-90 transition"
              />
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">{hotel.hotelName}</h3>
                <p className="text-sm text-gray-600">{hotel.location?.name}, {hotel.location?.country}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">⭐ {hotel.stars} Star</span>
                  <div className="text-right">
                    <p className="text-blue-600 font-bold"> ₹{Math.ceil(hotel.priceFrom*85.38)}</p>
                    <p className="text-sm text-gray-500">Per night</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelSearchResult;
