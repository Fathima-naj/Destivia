import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { createBookingOrder ,clearBookingState} from "../../slice/bookingSlice";
import axiosInstance from "../../api/axiosInstance";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const FlightBookingForm = () => {
  
   
    const location=useLocation()
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const {flight,passengers}=location.state;
  console.log('passenger',passengers,"flight",flight);
  const flightData=flight
  console.log("flightData",flightData)
  const { loading, error, order } = useSelector((state) => state.booking);
   useEffect(() => {
          if (!flightData) {
            toast.error("No place details found");
            navigate('/places');
            return;
          }
        }, [flightData, navigate]);
        useEffect(() => {
            dispatch(clearBookingState());
            return () => dispatch(clearBookingState());
          }, [dispatch]);

  const numericPrice = parseFloat(flightData.price?.toString().replace(/[^\d.]/g, "")) || 0;
  const totalPrice = (numericPrice * passengers*85).toFixed(2); 
   const initialValues = {
    name: "",
    email: "",
    contact: "",
    paymentMethod: "razorpay",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contact: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
      .required("Contact is required"),
  });

  const handleBooking = async (values,{setSubmitting}) => {
    try{
      const token = await getToken();
       if (!token) {
                  toast.error("Authentication required");
                  return;
                }
    console.log("auth token",await token)
    const bookingData = {
     
       flight: [
            {
              flightId:flightData._id ,
              airline: flightData.airline,
              origin:flightData.origin,
              destination:flightData.destination,
              classType: flightData.class, 
              departureDate:flightData.departureAt, 
              seatsBooked:passengers
            }
          ],
          passengerCount:passengers,
      paymentMethod: values.paymentMethod,
      total: totalPrice,
      guest: {
        name: values.name,
        email: values.email,
        contact: values.contact,
      },
    };
    console.log('from flight bookingData',bookingData);
    
   await dispatch(createBookingOrder({ type: "flight", bookingData, token }));
    } catch (error) {
             console.error("Booking creation failed:", error);
             toast.error(error.message || "Failed to create booking");
           } finally {
             setSubmitting(false);
           }
  };

  
  useEffect(() => {
    const loadRazorpay = async () => {
      if (!order?.orderId) return;

      const token = await getToken();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Destivia Travel",
        description: `Booking for ${flight.airline} flight`,
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
                type: "flight",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            toast.success("Payment successful 🎉");
             dispatch(clearBookingState());
             navigate('/flight')
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
    //  navigate('/flight')
  }, [order]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Confirm Flight Booking</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleBooking}
        >
          <Form>
            <div className="mb-4 space-y-1 text-sm">
            <p><strong>Airline :</strong> {flightData.airline}</p>
              <p><strong>From :</strong> {flightData.origin}</p>
              <p><strong>To :</strong> {flightData.destination}</p>
              <p><strong>Class : </strong>{flightData.class}</p>
              <p><strong>Seats to be Booked : </strong> {passengers}</p>
              <p><strong>Total Price  : </strong> ₹ {totalPrice}</p>
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

            <label className="block mt-4 font-medium">Payment Method</label>
            <Field as="select" name="paymentMethod" className="w-full border px-3 py-2 mt-1">
              <option value="razorpay">Razorpay</option>
            </Field>

            <button
              type="submit"
              className="mt-4 bg-green-600 text-white cursor-pointer py-2 w-full rounded"
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>

            {error && <p className="text-red-500 mt-2">Error: {error}</p>}
          </Form>
        </Formik>
      </div>
    </div>
    </div>
  );
};

export default FlightBookingForm;
