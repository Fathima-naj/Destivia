import asyncHandler from "../utilis/asyncHandler.js";
import User from "../model/userModel.js"; 
import { deleteBookings, getUserBookings } from "../service/bookingService.js";

export const getAllUserBookings = asyncHandler(async (req, res) => {
  const clerkUserId = req.auth.userId;
  const user = await User.findOne({ clerkUserId });

  if (!user) {
    return res.status(404).json({ message: "User not found in DB" });
  }

  const bookings = await getUserBookings(user._id);
 console.log(bookings)
  res.status(200).json(bookings);
});

export const handleDeleteBooking = async (req, res) => {
  const { type, bookingId } = req.params;
  const clerkUserId = req.auth.userId;
  console.log("User ID from Clerk:", clerkUserId);
  console.log("Booking ID from params:", bookingId);
  
  try {
    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in DB" });
    }

    const result = await deleteBookings(user._id, type, bookingId);
    console.log("DELETE RESULT:", result);
    res.status(result.success ? 200 : 404).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

