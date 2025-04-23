import React from 'react';
import { useSelector } from 'react-redux';
import FlightSearchResults from '../Flight/FlightSearchResult';
import HotelSearchResult from '../Hotel/HotelSearchResult';
import PlaceSearchResults from '../Place/PlaceSearchResults';

const SearchResults = ({ activeTab, handleBookNow }) => {
  const { flights, loading: flightLoading } = useSelector((state) => state.flights);
  const { hotels, loading: hotelLoading } = useSelector((state) => state.hotels);
  const { places, status: placeLoading } = useSelector((state) => state.place);

  // Only render the section if there are results or if loading
  const shouldShow = (flights?.length > 0 || hotels?.length > 0 || places?.length > 0 || 
                     flightLoading || hotelLoading || placeLoading === 'loading');

  if (!shouldShow) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Search Results</h2>
        
        <div className="max-w-7xl mx-auto">
          {activeTab === "flights" && (
            <div className="grid grid-cols-1 gap-4">
              {flightLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for flights...</p>
                </div>
              ) : flights?.length > 0 ? (
                <FlightSearchResults flights={flights} />
              ) : (
                <div className="text-center py-8 text-gray-600">
                  No flights found. Try different search criteria.
                </div>
              )}
            </div>
          )}

          {activeTab === "hotels" && (
            <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelLoading ? (
                <div className="col-span-full w-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for hotels...</p>
                </div>
              ) : hotels?.length > 0 ? (
                <HotelSearchResult hotels={hotels} handleBookNow={handleBookNow} />
              ) : (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No hotels found. Try different search criteria.
                </div>
              )}
            </div>
          )}

          {activeTab === "attractions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {placeLoading === 'loading' ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Searching for attractions...</p>
                </div>
              ) : places?.length > 0 ? (
                <PlaceSearchResults places={places} />
              ) : (
                <div className="col-span-full text-center py-8 text-gray-600">
                  No attractions found. Try different search criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;