import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../slice/getbookSlice";
import { useAuth } from "@clerk/clerk-react";
import { deleteBooking } from "../slice/getbookSlice";
import { Hotel, MapPin, Plane } from "lucide-react";

const UserBookings = () => {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { hotel, place, flight, loading, error } = useSelector((state) => state.bookings);
  const [activeTab, setActiveTab] = useState("hotel"); 

  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      dispatch(fetchUserBookings(token));
    };
    fetchData();
  }, [dispatch, getToken]);

  const handleDelete = async (type, bookingId) => {
    console.log("Deleting:", type, bookingId);
    const token = await getToken();
  
    try {
      
      const result = await dispatch(deleteBooking({ type, bookingId, token }));
  
      if (result.success) {
        console.log(`Successfully deleted ${type} booking`);
  
        
        dispatch(fetchUserBookings(token));
      } else {
        console.log("Failed to delete booking");
       
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      
    }
  };
  
  
  

  if (loading) return <p className="text-center text-white">Loading your bookings...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-yellow-800 mb-8">Your Bookings</h2>

      <div className="flex justify-center gap-4 mb-8">
        {["hotel", "place", "flight"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-6 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2
              ${activeTab === tab
                ? "bg-yellow-800 text-white"
                : "bg-white text-yellow-800 hover:bg-yellow-50 border border-yellow-800"}`}
          >
            {tab === "hotel" && (
              <>
                <Hotel className="w-5 h-5" /> Hotels
              </>
            )}
            {tab === "place" && (
              <>
                <MapPin className="w-5 h-5" /> Attractions
              </>
            )}
            {tab === "flight" && (
              <>
                <Plane className="w-5 h-5" /> Flights
              </>
            )}
          </button>
        ))}
      </div>

      {activeTab === "hotel" && (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotel.length ? (
            hotel.map((item) => (
              <div key={item.hotel.hotelId} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <img src={item.hotel.imageUrl[2]} alt={item.hotel.hotelName} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-yellow-800">{item.hotel.hotelName}</h3>
                  <p className="text-gray-600">{item.location}</p>
                  <div className="mt-3 space-y-1 text-gray-700">
                    <p>🛎 Check-in: {item.checkIn.split('T')[0]}</p>
                    <p>🏁 Check-out: {item.checkOut.split('T')[0]}</p>
                  </div>
                  <p className={`mt-3 font-medium ${item.status === 'Booked' ? 'text-green-600' : 'text-amber-600'}`}>
                    Status: {item.status}
                  </p>
                  <button
                    onClick={() => handleDelete("hotel", item._id)}
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No hotel bookings found.</p>
          )}
        </section>
      )}

     
      {activeTab === "place" && (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {place.length ? (
            place.map((item) => (
              <div key={item.place._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <img src={item.place.photos[3]} alt={item.place.name} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-yellow-800">{item.place.name}</h3>
                  <p className="text-gray-600">{item.place.address}</p>
                  <p className={`mt-3 font-medium ${item.status === 'Booked' ? 'text-green-600' : 'text-amber-600'}`}>
                    Status: {item.status}
                  </p>
                  <button
                    onClick={() => handleDelete("place", item._id)}
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No attraction bookings found.</p>
          )}
        </section>
      )}

      {activeTab === "flight" && (
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flight.length ? (
            flight.map((item) => (
              <div key={item.flight[0]._id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-yellow-800">{item.flight[0].airline}</h3>
                  <p className="text-gray-600">{item.flight[0].origin} → {item.flight[0].destination}</p>
                  <p className="mt-3 text-gray-700">📅 Date: {item.flight[0].departureDate.split('T')[0]}</p>
                  <p className={`mt-3 font-medium ${item.status === 'Booked' ? 'text-green-600' : 'text-amber-600'}`}>
                    Status: {item.status}
                  </p>
                  <button
                    onClick={() => handleDelete("flight", item._id)}
                    className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No flight bookings found.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default UserBookings;
