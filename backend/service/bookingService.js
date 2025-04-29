import Hbook from "../model/hotelbookModel.js";
import Pbook from "../model/placebookModel.js";
import Fbook from "../model/flightbookModel.js";
import Flight from "../model/flightModel.js";

import Hotel from "../model/hotelModel.js";
import Place from "../model/placeModel.js"; 
import mongoose from "mongoose";

export const getUserBookings = async (userId) => {
  try {
    const [hotelBookings, placeBookings, flightBookings] = await Promise.all([
      Hbook.find({ user: userId }).sort({ createdAt: -1 }),
      Pbook.find({ user: userId }).sort({ createdAt: -1 }),
      Fbook.find({ user: userId }).sort({ createdAt: -1 }),
    ]);
    return {
      hotel: hotelBookings,
      place: placeBookings,
      flight: flightBookings,
    };
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    throw new Error("Error fetching user bookings");
  }
};

export const deleteBookings = async (userId, type, bookingId) => {
  try {
    let result;

if (type === "hotel") {
  result = await Hbook.findOneAndDelete({ _id: bookingId, user: userId });
 console.log('hotel results',result)
 
  if (result) {
    const { hotel:{hotelId}, room:{roomNumber}, checkIn, checkOut } = result;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    console.log("Trying to update hotel with hotelId:", hotelId, "roomNumber:", roomNumber);

    const hotel = await Hotel.findById(hotelId);
const room = hotel.rooms.find(r => r.roomNumber === roomNumber);

if (room) {
  room.bookedDates = room.bookedDates.filter(date => {
    return !(date.checkIn.getTime() === new Date(checkIn).getTime() &&
             date.checkOut.getTime() === new Date(checkOut).getTime());
  });

  await hotel.save();
}

    console.log("Updated hotel room after booking cancellation:", hotel);

    return { success: true, message: "Hotel booking deleted and room booking removed" };
  }
}



    if (type === "flight") {
      const booking = await Fbook.findOne({
        _id: new mongoose.Types.ObjectId(bookingId),
        user: new mongoose.Types.ObjectId(userId),
      });

      if (!booking) {
        return { success: false, message: "Flight booking not found" };
      }

      const flightIdRaw = booking.flight[0]?.flightId;
      if (!flightIdRaw) {
        return { success: false, message: "Flight ID missing in booking" };
      }

      let flightId;
      try {
        flightId = new mongoose.Types.ObjectId(flightIdRaw);
      } catch (error) {
        return { success: false, message: "Invalid flight ID format" };
      }

      const flight = await Flight.findById(flightId);
      if (!flight) {
        return { success: false, message: "Flight not found" };
      }

      const passengers = booking.passengerCount || 0;

      await Flight.findByIdAndUpdate(flightId, {
        $inc: { seatsAvailable: passengers },
      });

      const deletedBooking = await Fbook.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(bookingId),
        user: new mongoose.Types.ObjectId(userId),
      });

      if (!deletedBooking) {
        return { success: true, message: "Booking already deleted" };
      }

      return {
        success: true,
        message: "Flight booking deleted and seat count updated",
      };
    }
    if (type === "place") {
      const booking = await Pbook.findOne({
        _id: new mongoose.Types.ObjectId(bookingId),
        user: new mongoose.Types.ObjectId(userId),
      });

      if (!booking) {
        return { success: false, message: "Place booking not found" };
      }

      const placeId = booking.place.placeId;
      const persons = booking.persons;

      const place = await Place.findById(placeId);
      if (!place) {
        return { success: false, message: "Place not found" };
      }

      // Decrease ticket count in the place model
      place.tickets += persons;

      await place.save();

      const deletedBooking = await Pbook.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(bookingId),
        user: new mongoose.Types.ObjectId(userId),
      });

      if (!deletedBooking) {
        return { success: true, message: "Booking already deleted" };
      }

      return {
        success: true,
        message: "Place booking deleted and ticket count updated",
      };
    }


    return { success: false, message: "Invalid booking type" };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, message: "An error occurred while deleting the booking" };
  }
};
