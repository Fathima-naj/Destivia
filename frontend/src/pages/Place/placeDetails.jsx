import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaceDetails } from '../../slice/placeSlice';
import PlaceBookingForm from './PlaceBookingForm';
import { getBookingHistory } from '../../slice/bookingSlice';
import { useAuth } from '@clerk/clerk-react';

const PlaceDetails = () => {
  const dispatch = useDispatch();
  const { fsq_id } = useParams();
 
  const navigate = useNavigate();
  const bookingHistory = useSelector(state => state.booking.bookingHistory);
  // console.log('hidtory',bookingHistory)

  const { selectedPlace: place, status, error } = useSelector((state) => state.place);
// console.log(bookingHistory)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBooked, setIsBooked] = useState(false);
  const { getToken } = useAuth();
  const token = getToken();

  useEffect(() => {
    
    dispatch(fetchPlaceDetails(fsq_id));
  
    
    const fetchHistory = async () => {
      const token = await getToken();
      if (token) {
        dispatch(getBookingHistory(token));
      }
    };
  
    fetchHistory();
  }, [dispatch, fsq_id, getToken]); 
  
  useEffect(() => {
    const checkBookingStatus = () => {
      const hasBooked = bookingHistory?.placeBookings?.some(
        (booking) => booking.place?.fsq_id === fsq_id
      );
      setIsBooked(hasBooked);
    };
  
    if (bookingHistory?.placeBookings?.length > 0) {
      checkBookingStatus();
    }
  }, [bookingHistory, fsq_id]); 
  
  useEffect(() => {
    if (bookingHistory?.data?.placeBookings?.length > 0) {
      console.log("Booking history:", bookingHistory);
  
      const checkBookingStatus = () => {
        const bookingsExist = bookingHistory?.data?.placeBookings?.length > 0;
        console.log("Bookings exist:", bookingsExist);
  
        const hasBooked = bookingsExist && bookingHistory.data.placeBookings.some((booking, index) => {
          console.log(`Checking booking #${index}:`, booking);
          console.log("Full place object:", booking?.place); 
  
          const placeFsqId = booking?.place?.placeId?.fsq_id;
          console.log("Place fsq_id:", placeFsqId);
          return placeFsqId === fsq_id;
        });
  
        console.log('Has the place been booked?', hasBooked);
        setIsBooked(hasBooked);
      };
  
      checkBookingStatus();
    } else {
      console.log("No place bookings found in booking history.");
    }
  }, [bookingHistory, fsq_id]);
  
  useEffect(() => {
    if (place?.photos?.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % place.photos.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [place]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? place.photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % place.photos.length);
  };

  if (status === 'loading') return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (status === 'failed') return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!place) return null;

  const visibleImages = place.photos?.slice(currentIndex, currentIndex + 3) || [];
  const overflowImages =
    visibleImages.length < 3
      ? [...visibleImages, ...place.photos.slice(0, 3 - visibleImages.length)]
      : visibleImages;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={() => navigate('/places')}
        className="mb-4 flex cursor-pointer items-center text-gray-600 hover:text-gray-800 transition"
      >
        <FaArrowLeft className="mr-2" />
        <span>Back</span>
      </button>

      {place.photos?.length > 0 && (
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg mb-8">
          <div className="flex transition-all duration-700 ease-in-out">
            {overflowImages.map((photo, i) => (
              <img
                key={i}
                src={photo}
                alt={`Place view ${i}`}
                className="w-1/3 h-72 object-cover"
              />
            ))}
          </div>
          <button
            className="absolute cursor-pointer top-1/2 left-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow"
            onClick={handlePrev}
          >
            <FaArrowLeft />
          </button>
          <button
            className="absolute top-1/2 cursor-pointer right-3 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 rounded-full p-2 shadow"
            onClick={handleNext}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <div className="mb-8 bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{place.name}</h1>
        <p className="text-gray-500 text-base mb-3">📍 {place.address}</p>

        <div className="flex items-center justify-between flex-wrap gap-3 mt-4">
          <p className="text-blue-600 font-semibold text-lg bg-blue-50 px-3 py-1 rounded-md">
            🎫 Entry Fee: ${place.ticketPrice}
          </p>
          
          {isBooked ? (
            <button
              disabled
              className="bg-yellow-700/50 text-white cursor-pointer px-6 py-2 rounded-lg shadow-md text-sm md:text-base cursor-not-allowed"
            >
               Booked
            </button>
          ) : (
            <button
            onClick={() => navigate('/p-booking', { state: { place: place } })}
            className="bg-yellow-600 cursor-pointer hover:bg-yellow-700 text-white px-6 py-2 rounded-lg shadow-md text-sm md:text-base transition duration-200"
          >
            Book Ticket
          </button>
          
          )}
        </div>
      </div>

      {place.tips?.length > 0 && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-3">💡 Traveler Tips</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-base">
            {place.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8 bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => console.log('Added to Wishlist')}
            className="bg-pink-100 cursor-pointer hover:bg-pink-200 text-pink-600 font-medium px-4 py-2 rounded-md transition duration-200"
          >
            ❤️ Add to Wishlist
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-3">🗺️ Location Map</h2>
        <iframe
          title="Google Maps"
          width="100%"
          height="350"
          className="rounded-lg shadow"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${place.latitude},${place.longitude}&output=embed`}
        ></iframe>
      </div>
    </div>
  );
};

export default PlaceDetails;
