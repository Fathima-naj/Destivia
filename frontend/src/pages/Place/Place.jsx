import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaces } from '../../slice/placeSlice';
import PlaceCard from './PlaceCard';
import Pagebar from '../../components/pagebar';
import PlaceInput from './PlaceInput';
import PlaceSearchResults from './PlaceSearchResults';

const popularSuggestions = [
  
  { city: 'New York', place: 'Statue of Liberty' },
  { city: 'Rome', place: 'Colosseum' },
  { city: 'Europe', place: 'London' },
  { city: 'Bangkok', place: 'Wat Arun' },
];

const SearchCity = () => {
  const dispatch = useDispatch();
  const [city, setCity] = useState('');
  const [query, setQuery] = useState('');
  const { places, status, error } = useSelector((state) => state.place);

  const handleSearch = () => {
    if (!city && !query) return alert('Enter at least a city or place name');
    dispatch(fetchPlaces({ city, query }));
  };

  const handlePopularClick = (city, place) => {
    setCity(city);
    setQuery(place);
    dispatch(fetchPlaces({ city, query: place }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      

      <div
        className="relative bg-cover bg-center h-[370px] sm:h-[450px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="backdrop-blur-md bg-white/30 border border-white/20 p-6 sm:p-8 rounded-xl shadow-2xl w-[90%] max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 mb-2">Find Your Next Adventure</h1>
          <p className="text-gray-700 mb-4">Type a city or place to explore amazing destinations around the globe.</p>
          <PlaceInput
          city={city}
          query={query}
          setCity={setCity}
          setQuery={setQuery}
          handleSearch={handleSearch}
          />

          <div className="mt-5">
            <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSuggestions.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularClick(item.city, item.place)}
                  className="text-sm cursor-pointer bg-white/80 hover:bg-white text-indigo-700 border border-indigo-300 px-3 py-1 rounded-full shadow-sm transition-all"
                >
                  {item.place}, {item.city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {status === 'loading' && (
          <p className="text-center text-gray-600 text-lg animate-pulse">Loading...</p>
        )}
        {status === 'failed' && (
          <p className="text-center text-red-500">{error}</p>
        )}
          
                  { places.length === 0 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Explore Top Places</h2>
            <p className="text-center text-gray-500 mb-6">Discover iconic places from cities around the world</p>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { name: 'Paris', image: '/assets/paris.jpg' },
                { name: 'New York', image: '/assets/ny.jpg' },
                { name: 'Dubai', image: '/assets/dubai.jpg' },
                { name: 'Tokyo', image: '/assets/tokyo.jpg' },
              ].map((item, index) => (
                <div
                  key={index}
                  onClick={() => handlePopularClick(item.name, '')}
                  className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
                  <div className="p-3">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Explore top attractions in {item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <PlaceSearchResults
        status={status}
        places={places}
        error={error}
        />
        
        
      </div>
    </div>
  );
};

export default SearchCity;
