
import React from 'react';
import PlaceCard from './PlaceCard';

const PlaceSearchResults = ({ status, places, error }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {status === 'loading' && (
        <p className="text-center text-gray-600 text-lg animate-pulse">Loading...</p>
      )}
      {status === 'failed' && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {places.length === 0 && status === 'succeeded' && (
        <div className="text-center text-gray-500 mt-10 text-lg">
          No places found. Try a different search.
        </div>
      )}

      {status === 'succeeded' && places.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 transition-all">
          {places.map((place) => (
            <PlaceCard key={place._id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceSearchResults;
