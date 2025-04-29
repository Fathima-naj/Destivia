import razorpayInstance from "../config/razorpay.js";
import User from "../model/userModel.js";
import Hbook from "../model/hotelbookModel.js";
import Fbook from "../model/flightbookModel.js";
import Pbook from "../model/placebookModel.js";
import Hotel from "../model/hotelModel.js";
import Flight from "../model/flightModel.js";
import Place from "../model/placeModel.js"
import crypto from "crypto";

const modelMap = {
  hotel: Hbook,
  flight: Fbook,
  place: Pbook,
};


export const createRazorpayOrderAndSave = async ({ req, type, bookingData }) => {
  console.log("Auth Info:", req.auth);
 console.log('bookData..',bookingData);

 
  try {
    const userClerkId = req.auth.userId;
    if (!userClerkId) throw new Error("Unauthorized");

    const user = await User.findOne({ clerkUserId: userClerkId });
    if (!user) throw new Error("User not found");

    const Model = modelMap[type];
    if (!Model) throw new Error("Invalid booking type");

    const {
      total,
      paymentMethod,
      persons,
      hotel,
      flight,
      place,
      checkIn,
      checkOut,
      ...restDetails
    } = bookingData;

    const num = parseFloat(total);
    if (!num || isNaN(num)) {
      throw new Error("Invalid or missing total");
    }

    const orderOptions = {
      amount: Math.round(num * 100),
      currency: "INR",
      receipt: `${type}_booking_${Date.now()}`,
      notes: {
        bookingType: type,
        userId: user._id.toString(),
      },
    };

    const order = await razorpayInstance.orders.create(orderOptions);

    // HOTEL BOOKING
    if (type === "hotel") {
     
      if (!bookingData.hotel || !bookingData.checkIn || !bookingData.checkOut) {
        throw new Error("Missing hotel details or dates");
      }
      
    
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const totalNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 3600 * 24));
      if (totalNights <= 0) throw new Error("Invalid check-in or check-out dates");
    
      const hotelDoc = await Hotel.findById(bookingData.hotel?.hotelId);
      if (!hotelDoc) throw new Error("Hotel not found");
    
      const bookingRooms = [];
      const { hotelId } = bookingData.hotel;
     const { roomType } = bookingData.room; 
      //const checkInDate = new Date(checkIn);
      //const checkOutDate = new Date(checkOut);

      
      const matchingRooms = hotelDoc.rooms.filter(
        (r) => r.roomType.toLowerCase() === roomType.toLowerCase()
      );
      
      if (!matchingRooms.length)
        throw new Error(`No rooms of type ${roomType} found`);
      
      let availableRoom = null;
      
      for (const room of matchingRooms) {
        const isBooked = room.bookedDates.some((dateRange) => {
          const bookedStart = new Date(dateRange.checkIn);
          const bookedEnd = new Date(dateRange.checkOut);
          return checkInDate < bookedEnd && checkOutDate > bookedStart;
        });
      
        if (!isBooked) {
          availableRoom = room;
          break;
        }
      }
      
      if (!availableRoom) {
        throw new Error(
          `No available ${roomType} rooms from ${checkInDate} to ${checkOutDate}`
        );
      }
      
      availableRoom.bookedDates.push({
        checkIn: checkInDate,
        checkOut: checkOutDate,
      });
      
      bookingRooms.push({
        ...availableRoom.toObject(),
        hotelId: hotelDoc._id,
        roomType: availableRoom.roomType,
        pricePerNight: availableRoom.pricePerNight,
      });
      
    
      await hotelDoc.save();
      const overallCheckIn = new Date(bookingData.checkIn);
      const overallCheckOut = new Date(bookingData.checkOut);

      const newBooking = new Hbook({
        user: user._id,
    
        hotel: {
          hotelId: hotelDoc._id,
          hotelName: hotelDoc.hotelName,
          imageUrl: hotelDoc.images,
          location: {
            name: hotelDoc.location?.name || "",
            country: hotelDoc.location?.country || "",
            address: hotelDoc.location?.address || "",
          },
        },
    
        room: {
          roomType: bookingRooms[0].roomType,
          roomNumber:bookingRooms[0].roomNumber,
          pricePerNight: bookingRooms[0].pricePerNight,
          roomsBooked: bookingRooms.length,
        },
    
        guests: {
          adults: bookingData.guests?.adults || 1,
          children: bookingData.guests?.children || 0,
        },
    
        checkIn: overallCheckIn,
        checkOut: overallCheckOut,
        totalNights,
        total,
        paymentMethod,
        currency: "INR",
    
        razorpayOrderId: order.id,
        razorpayPaymentStatus: "pending",
        status: "pending",
      });
    
      await newBooking.save();
    
      return {
        orderId: order.id,
        amount: order.amount,
        bookingId: newBooking._id,
      };
    }
    

    // FLIGHT BOOKING 

if (type === "flight") {
  const formattedFlights = [];

  
  for (const f of flight) {
    const flightDoc = await Flight.findById(f.flightId);

    if (!flightDoc) {
      throw new Error("Flight not found");
    }

    const seatsToBook = f.seatsBooked || 1;

    
    if (flightDoc.seatsAvailable < seatsToBook) {
      throw new Error(
        `Not enough seats available for flight ${flightDoc.airline} from ${flightDoc.origin} to ${flightDoc.destination}`
      );
    }

    
    flightDoc.seatsAvailable -= seatsToBook;

    await flightDoc.save();

    formattedFlights.push({
      flightId: f.flightId,
      airline: f.airline,
      origin: f.origin,
      destination: f.destination,
      classType: f.classType,
      departureDate: f.departureDate,
      seatsBooked: seatsToBook,
    });
  }


  const passengerCount =
    bookingData.passengerCount ||
    formattedFlights.reduce((sum, f) => sum + f.seatsBooked, 0);

  const newFlightBooking = new Fbook({
    user: user._id,
    flight: formattedFlights,
    passengerCount,
    paymentMethod,
    total,
    currency: "INR",
    razorpayOrderId: order.id,
    status: "pending",
    razorpayPaymentStatus: "pending",
  });

  
  await newFlightBooking.save();

  return {
    orderId: order.id,
    amount: order.amount,
    bookingId: newFlightBooking._id,
  };
}


    //  PLACE BOOKING
    if (type === "place") {
      console.log(place.fsq_id);
      
      if (!place?.fsq_id) throw new Error("Place details are missing");
    
      const placeDoc =await Place.findOne({ fsq_id: place.fsq_id });
      if (!placeDoc) throw new Error("Place not found");
     console.log(placeDoc)
      const persons = bookingData.persons || 1;
    
      if (placeDoc.tickets < persons) {
        throw new Error(`Only ${placeDoc.tickets} tickets available for this place`);
      }
    
      
      placeDoc.tickets -= persons;
      await placeDoc.save();
    
      const newPlaceBooking = new Model({
        user: user._id,
        paymentMethod,
        persons,
        total,
        razorpayOrderId: order.id,
        status: "pending",
        razorpayPaymentStatus: "pending",
        place,
        persons,
        ...restDetails,
      });
    
      await newPlaceBooking.save();
    
      return {
        orderId: order.id,
        amount: order.amount,
        bookingId: newPlaceBooking._id,
      };
    }
    

    throw new Error("Booking type handler missing.");
  } catch (err) {
    console.error("[Razorpay Booking Error]:", err?.message || err);
    throw new Error(err?.message || "Something went wrong while creating the booking.");
  }
  
};


// export const verifyRazorpayPaymentAndConfirmBooking = async ({
//   razorpayPaymentId,
//   razorpayOrderId,
//   razorpaySignature,
// }) => {
//   try {
//     const generatedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest("hex");

//     if (generatedSignature !== razorpaySignature) {
//       throw new Error("Payment signature verification failed");
//     }

//     let booking = null;
//     for (let type in modelMap) {
//       booking = await modelMap[type].findOne({ razorpayOrderId });
//       if (booking) break;
//     }

//     if (!booking) {
//       throw new Error("Booking not found for the given order ID");
//     }

//     booking.razorpayPaymentId = razorpayPaymentId;
//     booking.razorpayPaymentStatus = "paid";
//     booking.status = "completed";
//     await booking.save();

//     return {
//       success: true,
//       message: "Payment verified and booking confirmed",
//       bookingId: booking._id,
//     };
//   } catch (error) {
//     console.error("Payment verification error:", error);
//     throw new Error("Payment verification failed");
//   }
// };

export const verifyRazorpayPaymentAndConfirmBooking = async ({
  razorpayPaymentId,
  razorpayOrderId,
  razorpaySignature,
}) => {
  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      throw new Error("Payment signature verification failed");
    }

    let booking = null;
    for (let type in modelMap) {
      booking = await modelMap[type].findOne({ razorpayOrderId });
      if (booking) break;
    }

    if (!booking) {
      throw new Error("Booking not found for the given order ID");
    }

    booking.razorpayPaymentId = razorpayPaymentId;
    booking.razorpayPaymentStatus = "paid";
    booking.status = "completed"; // updated
    booking.bookingStatus = "booked"; // newly added field
    await booking.save();

    return {
      success: true,
      message: "Payment verified and booking confirmed",
      bookingId: booking._id,
    };
  } catch (error) {
    console.error("Payment verification error:", error);
    throw new Error("Payment verification failed");
  }
};

export const getBookingHistory = async (userId) => {
  try {
    // Fetch hotel bookings
    const hotelBookings = await Hbook.find({ user: userId }).populate("hotel.hotelId");

    // Fetch flight bookings
    const flightBookings = await Fbook.find({ user: userId }).populate("flight.flightId");

    // Fetch place bookings
    const placeBookings = await Pbook.find({ user: userId }).populate("place.placeId");

    return {
      hotelBookings,
      flightBookings,
      placeBookings,
    };
  } catch (error) {
    throw new Error("Failed to fetch booking history: " + error.message);
  }
};