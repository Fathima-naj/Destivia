import React from 'react'

        const PlaceInput=({
            city,
            query,
            setCity,
            setQuery,
            handleSearch
        })=> {
          return (
            <div>
                <div className="space-y-3">
            <input
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white/90"
              type="text"
              placeholder="Enter city name (e.g. Rome)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white/90"
              type="text"
              placeholder="Enter place name (e.g. Colosseum)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="w-full bg-yellow-600 hover:bg-indigo-700 text-white font-semibold py-3 cursor-pointer rounded-lg transition shadow-lg"
            >
              Search
            </button>
          </div>

    </div>
  )
}

export default PlaceInput
