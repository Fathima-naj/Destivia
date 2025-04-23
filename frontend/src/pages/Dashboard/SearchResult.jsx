import React from "react";
import FlightSearchResults from "../Flight/FlightSearchResult";
import HotelSearchResult from "../Hotel/HotelSearchResult";
import PlaceSearchResults from "../Place/PlaceSearchResults";
import FlightSearchList from "../Flight/Flight";

function SearchResults({ activeTab, searchResults, loading, error }) {
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4 mt-6">
      {activeTab === "flights" && searchResults.flights && searchResults.flights.length > 0 && (
        <FlightSearchList flights={searchResults.flights} />
      )}
      {activeTab === "hotels" && searchResults.hotels && searchResults.hotels.length > 0 && (
        <HotelSearchResult hotels={searchResults.hotels} />
      )}
      {activeTab === "attractions" && searchResults.places && searchResults.places.length > 0 && (
        <PlaceSearchResults places={searchResults.places} />
      )}
    </div>
  );
}

export default SearchResults;
