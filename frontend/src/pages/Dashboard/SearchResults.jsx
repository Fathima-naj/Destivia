import React from 'react';
import { useSelector } from 'react-redux';
import FlightSearchResults from '../Flight/FlightSearchResult';
import HotelSearchResult from '../Hotel/HotelSearchResult';
import PlaceSearchResults from '../Place/PlaceSearchResults';

const SearchResults = ({ activeTab, handleBookNow }) => {
  const { flights, loading: flightLoading } = useSelector((state) => state.flights);
  const { hotels, loading: hotelLoading } = useSelector((state) => state.hotels);
  const { places, status: placeLoading } = useSelector((state) => state.place);

  const LoadingSpinner = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-600">Searching...</p>
    </div>
  );

  const NoResults = ({ type }) => (
    <div className="col-span-full text-center py-8 text-gray-600">
      No {type} found. Try different search criteria.
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Search Results</h2>
      
      <div className="space-y-8">
        {activeTab === "flights" && (
          <div className="grid grid-cols-1 gap-6">
            {flightLoading ? (
              <LoadingSpinner />
            ) : flights?.length > 0 ? (
              <div className="space-y-4">
                <FlightSearchResults 
                  flights={flights}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                />
              </div>
            ) : (
              <NoResults type="flights" />
            )}
          </div>
        )}

        {activeTab === "hotels" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelLoading ? (
              <LoadingSpinner />
            ) : hotels?.length > 0 ? (
              <HotelSearchResult 
                hotels={hotels} 
                handleBookNow={handleBookNow}
                className="h-full"
              />
            ) : (
              <NoResults type="hotels" />
            )}
          </div>
        )}

        {activeTab === "attractions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeLoading === 'loading' ? (
              <LoadingSpinner />
            ) : places?.length > 0 ? (
              <PlaceSearchResults 
                places={places}
                className="h-full" 
              />
            ) : (
              <NoResults type="attractions" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;