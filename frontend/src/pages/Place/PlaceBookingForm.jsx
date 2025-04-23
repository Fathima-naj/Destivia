import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch, useSelector } from "react-redux";
import { createBookingOrder , clearBookingState} from "../../slice/bookingSlice";
import axiosInstance from "../../api/axiosInstance";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const PlaceBookingForm = () => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const location=useLocation()
  const {place}=location.state;
  const { loading, error, order } = useSelector((state) => state.booking);
  const navigate=useNavigate()

  useEffect(() => {
        if (!place) {
          toast.error("No place details found");
          navigate('/places');
          return;
        }
      }, [place, navigate]);

        useEffect(() => {
    dispatch(clearBookingState());
    return () => dispatch(clearBookingState());
  }, [dispatch]);

  const initialValues = {
    name: "",
    email: "",
    contact: "",
    paymentMethod: "razorpay",
    numberOfPersons:1,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    contact: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number")
      .required("Contact is required"),
      numberOfPersons: Yup.number()
      .min(1, "At least 1 person required")
      .max(10, "Maximum 10 persons allowed")
      .required("Please specify the number of persons"),
    
  });

  const handleBooking = async (values, { setSubmitting }) => {
        try {
          const token = await getToken();
          if (!token) {
            toast.error("Authentication required");
            return;
          }
    
          const totalPersons = Number(values.numberOfPersons);
          const bookingData = {
            place: {
              placeId: place._id,
              fsq_id: place.fsq_id,
              name: place.name,
              address: place.address,
              photos: place.photos,
              ticketPrice: place.ticketPrice,
            },
            paymentMethod: values.paymentMethod,
            total: place.ticketPrice * totalPersons,
            persons: totalPersons,
            guest: {
              name: values.name,
              email: values.email,
              contact: values.contact,
              //numberOfPersons: totalPersons,
            },
          };
    
          await dispatch(createBookingOrder({ type: "place", bookingData, token })).unwrap();
        } catch (error) {
          console.error("Booking creation failed:", error);
          toast.error(error.message || "Failed to create booking");
        } finally {
          setSubmitting(false);
        }
      };
    
  
   useEffect(() => {
    const loadRazorpay = async () => {
      if (!order?.orderId || !order?.amount || loading) return;

      try {
        const token = await getToken();
        if (!token) return;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: "INR",
          name: "Destivia Travel",
          description: `Booking for ${place.name}`,
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
                  },
                }
              );
              toast.success("Payment successful! 🎉");
              dispatch(clearBookingState());
              navigate('/places');
            } catch (err) {
              console.error("Payment verification failed:", err);
              toast.error("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: order.guest?.name,
            email: order.guest?.email,
            contact: order.guest?.contact,
          },
          modal: {
            ondismiss: function() {
              dispatch(clearBookingState());
            }
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Razorpay initialization failed:", error);
        toast.error("Payment initialization failed");
        dispatch(clearBookingState());
      }
    };

    loadRazorpay();
  }, [order?.orderId, loading]);


  return (
    <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
       
        <h2 className="text-xl font-bold mb-4">Confirm Place Ticket Booking</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleBooking}
        >
          <Form>
            <div className="mb-2">
              <p><strong>Destination:</strong> {place.name}</p>
              <p><strong>Location:</strong> {place.address}</p>
              <p><strong>Price:</strong>  ₹{place.ticketPrice}</p>
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
            
            <label className="block mt-4 font-medium">Number of Persons</label>
            <Field
              name="numberOfPersons"
              type="number"
              className="w-full border px-3 py-2 mt-1"
              min="1"
              max="10"
            />
            <ErrorMessage
              name="numberOfPersons"
              component="div"
              className="text-red-500 text-sm"
            />

            <label className="block mt-4 font-medium">Payment Method</label>
            <Field as="select" name="paymentMethod" className="w-full border px-3 py-2 mt-1">
              <option value="razorpay">Razorpay</option>
            </Field>

            <button
              type="submit"
              className="mt-4 cursor-pointer bg-green-600 text-white py-2 w-full rounded"
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>

            {error && <p className="text-red-500 mt-2">Error: {error}</p>}
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default PlaceBookingForm;


// import React, { useEffect } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import { useDispatch, useSelector } from "react-redux";
// import { createBookingOrder, clearBookingState } from "../../slice/bookingSlice";
// import axiosInstance from "../../api/axiosInstance";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom";

// const PlaceBookingForm = () => {
//   const { getToken } = useAuth();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { place } = location.state || {};
//   const { loading, error, order } = useSelector((state) => state.booking);

//   // Redirect if no place data
//   useEffect(() => {
//     if (!place) {
//       toast.error("No place details found");
//       navigate('/places');
//       return;
//     }
//   }, [place, navigate]);

//   // Clear booking state when component mounts or unmounts
//   useEffect(() => {
//     dispatch(clearBookingState());
//     return () => dispatch(clearBookingState());
//   }, [dispatch]);

   //const handleBooking = async (values, { setSubmitting }) => {
//     try {
//       const token = await getToken();
//       if (!token) {
//         toast.error("Authentication required");
//         return;
//       }

//       const totalPersons = Number(values.numberOfPersons);
//       const bookingData = {
//         place: {
//           placeId: place._id,
//           fsq_id: place.fsq_id,
//           name: place.name,
//           address: place.address,
//           photos: place.photos,
//           ticketPrice: place.ticketPrice,
//         },
//         paymentMethod: values.paymentMethod,
//         total: place.ticketPrice * totalPersons,
//         persons: totalPersons,
//         guest: {
//           name: values.name,
//           email: values.email,
//           contact: values.contact,
//           //numberOfPersons: totalPersons,
//         },
//       };

//       await dispatch(createBookingOrder({ type: "place", bookingData, token })).unwrap();
//     } catch (error) {
//       console.error("Booking creation failed:", error);
//       toast.error(error.message || "Failed to create booking");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   useEffect(() => {
//     const loadRazorpay = async () => {
//       if (!order?.orderId || !order?.amount || loading) return;

//       try {
//         const token = await getToken();
//         if (!token) return;

//         const options = {
//           key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//           amount: order.amount,
//           currency: "INR",
//           name: "Destivia Travel",
//           description: `Booking for ${place.name}`,
//           order_id: order.orderId,
//           handler: async function (response) {
//             try {
//               await axiosInstance.post(
//                 "/payment/verify",
//                 {
//                   razorpayOrderId: response.razorpay_order_id,
//                   razorpayPaymentId: response.razorpay_payment_id,
//                   razorpaySignature: response.razorpay_signature,
//                   bookingId: order.bookingId,
//                   type: "place",
//                 },
//                 {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                   },
//                 }
//               );
//               toast.success("Payment successful! 🎉");
//               dispatch(clearBookingState());
//               navigate('/places');
//             } catch (err) {
//               console.error("Payment verification failed:", err);
//               toast.error("Payment verification failed. Please contact support.");
//             }
//           },
//           prefill: {
//             name: order.guest?.name,
//             email: order.guest?.email,
//             contact: order.guest?.contact,
//           },
//           modal: {
//             ondismiss: function() {
//               dispatch(clearBookingState());
//             }
//           },
//           theme: {
//             color: "#3399cc",
//           },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } catch (error) {
//         console.error("Razorpay initialization failed:", error);
//         toast.error("Payment initialization failed");
//         dispatch(clearBookingState());
//       }
//     };

//     loadRazorpay();
//   }, [order?.orderId, loading]);

//   if (!place) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
       
//         <h2 className="text-xl font-bold mb-4">Confirm Place Ticket Booking</h2>

//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleBooking}
//         >
//           <Form>
//             <div className="mb-2">
//               <p><strong>Destination:</strong> {place.name}</p>
//               <p><strong>Location:</strong> {place.address}</p>
//               <p><strong>Price:</strong>  ₹{place.ticketPrice}</p>
//             </div>

//             <label className="block mt-4 font-medium">Full Name</label>
//             <Field name="name" className="w-full border px-3 py-2 mt-1" />
//             <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />

//             <label className="block mt-4 font-medium">Email</label>
//             <Field name="email" type="email" className="w-full border px-3 py-2 mt-1" />
//             <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

//             <label className="block mt-4 font-medium">Contact Number</label>
//             <Field name="contact" className="w-full border px-3 py-2 mt-1" />
//             <ErrorMessage name="contact" component="div" className="text-red-500 text-sm" />
            
//             <label className="block mt-4 font-medium">Number of Persons</label>
//             <Field
//               name="numberOfPersons"
//               type="number"
//               className="w-full border px-3 py-2 mt-1"
//               min="1"
//               max="10"
//             />
//             <ErrorMessage
//               name="numberOfPersons"
//               component="div"
//               className="text-red-500 text-sm"
//             />

//             <label className="block mt-4 font-medium">Payment Method</label>
//             <Field as="select" name="paymentMethod" className="w-full border px-3 py-2 mt-1">
//               <option value="razorpay">Razorpay</option>
//             </Field>

//             <button
//               type="submit"
//               className="mt-4 cursor-pointer bg-green-600 text-white py-2 w-full rounded"
//               disabled={loading}
//             >
//               {loading ? "Booking..." : "Confirm Booking"}
//             </button>

//             {error && <p className="text-red-500 mt-2">Error: {error}</p>}
//           </Form>
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default PlaceBookingForm;