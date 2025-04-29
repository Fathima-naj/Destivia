import express from "express"
const bookRouter = express.Router();
import { getAllUserBookings, handleDeleteBooking } from "../controller/bookingController.js";
import clerkAuth from "../middleware/authMiddleware.js";

bookRouter.get("/user-bookings", clerkAuth, getAllUserBookings);
bookRouter.delete(`/delete-booking/:type/:bookingId`,clerkAuth,handleDeleteBooking)
// bookRouter.get('/:id', async (req, res) => {
//     try {
//       const booking = await Pbook.findById(req.params.id); // Get booking by ID
//       if (!booking) {
//         return res.status(404).json({ message: "Booking not found" });
//       }
//       res.json({ bookingStatus: booking.bookingStatus });
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching booking" });
//     }
//   });
  
export default bookRouter
