import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { createBookingOrder } from "../../slice/bookingSlice";
import axiosInstance from "../../api/axiosInstance";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";


const HotelBookingForm = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { loading, error, order } = useSelector((state) => state.booking);
  const location = useLocation();
  const razorpayLaunched = useRef(false);

  const { checkIn, checkOut, adults, children, hotel } = location.state || {};

  const [selectedRoomType, setSelectedRoomType] = useState("single");
  const [availableCount, setAvailableCount] = useState(0);

  const initialValues = {
    name: "",
    email: "",
    contact: "",
    paymentMethod: "razorpay",
    rooms: 1,
    roomType: "single",
  };

  const getAvailableRoomsCount = (type) => {
    const filtered = hotel.rooms.filter((room) => {
      if (room.roomType.toLowerCase() !== type.toLowerCase()) return false;

      const isBooked = room.bookedDates.some((booking) => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        const userStart = new Date(checkIn);
        const userEnd = new Date(checkOut);
        return userStart < bookingEnd && userEnd > bookingStart;
      });

      return !isBooked;
    });

    return filtered.length;
  };

  useEffect(() => {
    const count = getAvailableRoomsCount(selectedRoomType);
    setAvailableCount(count);
  }, [selectedRoomType, hotel, checkIn, checkOut]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contact: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
      .required("Contact is required"),
    rooms: Yup.number().min(1).required(),
  });

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleBooking = async (values) => {
    const token = await getToken();
    const nights = calculateNights(checkIn, checkOut);
    const totalAmount = hotel.priceFrom * nights * values.rooms;

    const availableRoomCount = getAvailableRoomsCount(values.roomType);
     console.log('room count',availableRoomCount);
     
    if (availableRoomCount === 0) {
      toast.error("No rooms available for the selected type.");
      return;
    }

    if (values.rooms > availableRoomCount) {
      toast.error(`Only ${availableRoomCount} ${values.roomType} room(s) available`);
      return;
    }

    const availableRoom = hotel.rooms.find((room) => {
      return (
        room.roomType.toLowerCase() === values.roomType.toLowerCase() &&
        !room.bookedDates.some((booking) => {
          const bookingStart = new Date(booking.checkIn);
          const bookingEnd = new Date(booking.checkOut);
          const userStart = new Date(checkIn);
          const userEnd = new Date(checkOut);
          return userStart < bookingEnd && userEnd > bookingStart;
        })
      );
    });
    console.log("available room",availableRoom)

    const bookingData = {
      hotel: {
        hotelId: hotel._id,
        hotelName: hotel.hotelName,
        imageUrl: hotel.images,
      },
      room: {
        roomType: values.roomType,
        roomNumber: availableRoom?.roomNumber || 0,
        pricePerNight: hotel.priceFrom,
        roomsBooked: values.rooms,
      },
      guests: {
        adults,
        children,
      },
      checkIn,
      checkOut,
      totalNights: nights,
      paymentMethod: values.paymentMethod,
      total: totalAmount,
      guest: {
        name: values.name,
        email: values.email,
        contact: values.contact,
      },
    };

    dispatch(createBookingOrder({ type: "hotel", bookingData, token }));
  };

  useEffect(() => {
    const loadRazorpay = async () => {
      if (!order?.orderId) return;

      const token = await getToken();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "USD",
        name: "Travel Booking",
        description: "Destination Booking Payment",
        order_id: order.orderId,
        handler: async function (response) {
          try {
            await axiosInstance.post(
              "/payment/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                bookingId: order.bookingId,
                type: "place",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            toast.success("Payment successful 🎉");
          } catch (err) {
            console.error("Payment verification failed:", err);
            toast.error("Payment verification failed ❌");
          }
        },
        prefill: {
          name: order?.guest?.name || "Guest",
          email: order?.guest?.email || "guest@example.com",
          contact: order?.guest?.contact || "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };

    loadRazorpay();
    
  }, [order]);

  return (
    <div className="min-h-screen bg-gray-100">
    
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Confirm Hotel Booking</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleBooking}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="mb-4 text-sm">
                  <p><strong>Hotel:</strong> {hotel.hotelName}</p>
                  <p><strong>Price/Night:</strong> ₹{hotel.priceFrom * 85.38}</p>
                  <p><strong>Check-in:</strong> {checkIn}</p>
                  <p><strong>Check-out:</strong> {checkOut}</p>
                </div>

                <label className="block mt-4 font-medium">Full Name</label>
                <Field name="name" className="w-full border px-3 py-2 mt-1" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

                <label className="block mt-4 font-medium">Email</label>
                <Field name="email" type="email" className="w-full border px-3 py-2 mt-1" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

                <label className="block mt-4 font-medium">Contact Number</label>
                <Field name="contact" className="w-full border px-3 py-2 mt-1" />
                <ErrorMessage name="contact" component="div" className="text-red-500 text-sm" />

                <label className="block mt-4 font-medium">Rooms</label>
                <Field name="rooms" type="number" min="1" className="w-full border px-3 py-2 mt-1" />

                <label className="block mt-4 font-medium">Room Type</label>
                <Field
                  as="select"
                  name="roomType"
                  className="w-full border px-3 py-2 mt-1"
                  onChange={(e) => {
                    const value = e.target.value.toLowerCase();
                    setSelectedRoomType(value);
                    setFieldValue("roomType", value);
                  }}
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                </Field>
                {/* <p className="text-sm text-gray-600 mt-1">
                  {availableCount > 0
                    ? `Only ${availableCount} ${selectedRoomType} room(s) available`
                    : "No rooms available for selected type"}
                </p> */}

                <label className="block mt-4 font-medium">Payment Method</label>
                <Field as="select" name="paymentMethod" className="w-full border px-3 py-2 mt-1">
                  <option value="razorpay">Razorpay</option>
                </Field>

                <button
                  type="submit"
                  className="mt-6 bg-green-600 text-white py-2 w-full rounded hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>

                {error && <p className="text-red-500 mt-2">Error: {error}</p>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingForm;
