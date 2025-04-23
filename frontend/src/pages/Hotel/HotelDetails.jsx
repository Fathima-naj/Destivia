import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import HotelBookingForm from "./HotelBookingForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelById } from "../../slice/hotelSlice";
import React from "react";
import { FaArrowLeft,FaArrowRight } from "react-icons/fa";

const HotelDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showBookingForm, setShowBookingForm] = useState(false);
   const [isBooked, setIsBooked] = useState(false);
   const [currentIndex, setCurrentIndex] = useState(0);
 const location=useLocation()
 const { checkIn, checkOut, adults, children } = location.state || {};
  console.log(location.state)
  console.log(checkIn, checkOut, adults, children);
   const navigate=useNavigate()
  const { selectedHotel: hotel, loading, error } = useSelector((state) => state.hotels);

  useEffect(() => {
    dispatch(fetchHotelById(id));
  }, [dispatch, id]);

  
    useEffect(() => {
      if (hotel?.images?.length > 0) {
        const interval = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % hotel.images.length);
        }, 4000);
        return () => clearInterval(interval);
      }
    }, [hotel]);
  
    const handlePrev = () => {
      setCurrentIndex((prev) => (prev === 0 ? hotel.images.length - 1 : prev - 1));
    };
  
    const handleNext = () => {
      setCurrentIndex((prev) => (prev + 1) % hotel.images.length);
    };

  if (loading) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">Error: {error}</div>;
  if (!hotel) return <div className="text-center mt-10 text-gray-600">No hotel data available.</div>;

  const visibleImages = hotel.images?.slice(currentIndex, currentIndex + 3) || [];
  const overflowImages =
    visibleImages.length < 3
      ? [...visibleImages, ...hotel.images.slice(0, 3 - visibleImages.length)]
      : visibleImages;

  return (
   <div className="overflow-y-scroll h-screen scrollbar-hide">
    <button
        onClick={() => navigate('/hotels')}
        className="mb-4 flex items-center cursor-pointer text-gray-600 hover:text-gray-800 transition"
      >
        <FaArrowLeft className="mr-2 " />
        <span>Back</span>
      </button>
    <div className="p-8 max-w-4xl mx-auto">
     {hotel.images?.length > 0 && (
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
     
      <h1 className="text-3xl font-bold mt-4">{hotel.hotelName}</h1>
      <p className="text-sm text-gray-500">⭐ {hotel.stars} Star Hotel</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Facilities</h2>
        <ul className="list-disc pl-5 mt-2">
          <li>Free WiFi</li>
          <li>Swimming Pool</li>
          <li>Gym</li>
          <li>Room Service</li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Price</h2>
        <p className="text-blue-600 font-bold text-xl">₹{Math.ceil(hotel.priceFrom*85.38)} per night</p>
      </div>

      
      {/* {hotel.rooms && hotel.rooms.length > 0 && (
  <div className="mt-6">
    <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
    <div className="grid gap-4">
      {hotel.rooms.map((room, index) => (
        <div key={index} className="border p-4 rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{room.roomType}</h3>
              <p className="text-sm text-gray-500">Capacity: {room.capacity} Guests</p>
              {room.amenities && (
                <p className="text-sm text-gray-400">
                  Amenities: {room.amenities.join(', ')}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-blue-600 font-bold text-lg">${room.price}</p>
              <p className="text-sm text-gray-500">Per night</p>
            </div>
          </div>
        </div>
      ))}
      </div>
      </div>
      )}  */}

      {isBooked ? (
          <button
            disabled
            className="bg-gray-400 text-white px-6 py-2 rounded-lg shadow-md text-sm md:text-base cursor-not-allowed"
          >
            ✅ Booked
          </button>
        ) : (
          <button
            onClick={() => navigate('/h-booking',{ state: {
               hotel:hotel,
               checkIn:checkIn,
               checkOut:checkOut,
               adults:adults,
               children:children
              
              }})}
            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md text-sm md:text-base transition duration-200"
          >
            Book 
          </button>
        )}
      
    </div>
   </div>
  );
};

export default HotelDetails;
