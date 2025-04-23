import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Ticket, Star, Heart } from 'lucide-react';

const PlaceCard = ({ place }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  
  if (!place.photos || place.photos.length === 0) return null;

  const handleImageClick = () => {
    navigate(`/place/${place.fsq_id}`);
  };

  const toggleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group">
      <div className="relative cursor-pointer" onClick={handleImageClick}>
        <img
          src={place.photos[0]}
          alt={place.name}
          className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <button
          onClick={toggleLike}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-1 hover:scale-110 transition"
        >
          <Heart
            className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
          />
        </button>
      </div>

      <div className="p-5 space-y-2">
        <h2 className="text-xl font-bold text-gray-800">{place.name}</h2>

        <p className="text-sm text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          {place.address}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-semibold flex items-center gap-1">
            <Ticket className="w-4 h-4" />
            ₹{place.ticketPrice}
          </span>

          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span className="text-sm font-medium">4.5</span>
          </div>
        </div>

        <button
          onClick={handleImageClick}
          className="mt-3 inline-block cursor-pointer text-sm text-indigo-500 font-medium hover:underline"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};

export default PlaceCard;
