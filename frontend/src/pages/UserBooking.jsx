import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBookings } from "../slice/getbookSlice";
import { useAuth } from "@clerk/clerk-react";
import { deleteBooking } from "../slice/getbookSlice";

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
    <div className="p-4 md:p-8 max-w-5xl mx-auto text-white">
      <h2 className="text-2xl font-bold text-center text-black mb-6">🧾 Your Bookings</h2>

      <div className="flex justify-center gap-4 mb-8">
        {["hotel", "place", "flight"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize px-4 py-2 rounded-full font-medium transition-colors duration-200
              ${activeTab === tab
                ? "bg-indigo-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"}`}
          >
            {tab === "hotel" && "🏨 Hotels"}
            {tab === "place" && "📍 Attractions"}
            {tab === "flight" && "✈️ Flights"}
          </button>
        ))}
      </div>

      {activeTab === "hotel" && (
        <section>
          {hotel.length ? (
            hotel.map((item) => (
              <div key={item.hotel.hotelId} className="bg-gray-800 p-4 rounded-lg shadow mb-5">
                <img src={item.hotel.imageUrl[2]} alt={item.hotel.hotelName} className="w-full h-40 object-cover rounded mb-3" />
                <p className="text-lg font-medium">{item.hotel.hotelName}</p>
                <p className="text-sm text-gray-300">{item.location}</p>
                <p className="mt-2">🛎 Check-in: {item.checkIn.split('T')[0]}</p>
                <p>🏁 Check-out: {item.checkOut.split('T')[0]}</p>
                <p className={`mt-2 font-semibold ${item.status === 'Booked' ? 'text-green-400' : 'text-yellow-400'}`}>
                  Status: {item.status}
                </p>
                <button
                onClick={() => handleDelete("hotel", item._id)}
                className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Booking
              </button>

              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center">No hotel bookings found.</p>
          )}
        </section>
      )}

      {activeTab === "place" && (
        <section>
          {place.length ? (
            place.map((item) => (
              <div key={item.place._id} className="bg-gray-800 p-4 rounded-lg shadow mb-5">
                <img src={item.place.photos[3]} alt={item.place.name} className="w-full h-40 object-cover rounded mb-3" />
                <p className="text-lg font-medium">{item.place.name}</p>
                <p className="text-sm text-gray-300">{item.place.address}</p>
                <p className={`mt-2 font-semibold ${item.status === 'Booked' ? 'text-green-400' : 'text-yellow-400'}`}>
                  Status: {item.status}
                </p>
                <button
                onClick={() => handleDelete("place", item._id)}
                className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Booking
              </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center">No attraction bookings found.</p>
          )}
        </section>
      )}

      {activeTab === "flight" && (
        <section>
          {flight.length ? (
            flight.map((item) => (
              <div key={item.flight[0]._id} className="bg-gray-800 p-4 rounded-lg shadow mb-5">
                <p className="text-lg font-medium">{item.flight[0].airline}</p>
                <p className="text-sm text-gray-300">{item.flight[0].origin} → {item.flight[0].destination}</p>
                <p className="mt-2">📅 Date: {item.flight[0].departureDate.split('T')[0]}</p>
                <p className={`mt-2 font-semibold ${item.status === 'Booked' ? 'text-green-400' : 'text-yellow-400'}`}>
                  Status: {item.status}
                </p>
                <button
                onClick={() => handleDelete("flight", item._id)}
                className="mt-3 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Cancel Booking
              </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center">No flight bookings found.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default UserBookings;
