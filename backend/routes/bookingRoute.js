import express from "express"
const bookRouter = express.Router();
import { getAllUserBookings, handleDeleteBooking } from "../controller/bookingController.js";
import clerkAuth from "../middleware/authMiddleware.js";

bookRouter.get("/user-bookings", clerkAuth, getAllUserBookings);
bookRouter.delete(`/delete-booking/:type/:bookingId`,clerkAuth,handleDeleteBooking)
export default bookRouter
