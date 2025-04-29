import { createRazorpayOrderAndSave } from "../service/paymentService.js";
import asyncHandler from "../utilis/asyncHandler.js";
import { getBookingHistory } from "../service/paymentService.js";
import User from "../model/userModel.js"; 
export const createBookingOrder = async (req, res) => {
  try {
    const { type, bookingData } = req.body;

    if (!type || !bookingData) {
      return res.status(400).json({ success: false, message: "Missing type or booking data" });
    }

    const result = await createRazorpayOrderAndSave({
      req,
      type, // 'hotel' , 'flight' , 'place'
      bookingData,
    });

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      ...result,
    });

  } catch (err) {
    console.error('Payment error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
};
import { verifyRazorpayPaymentAndConfirmBooking } from "../service/paymentService.js";

export const confirmBookingPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId, type } = req.body;

  const updatedBooking = await verifyRazorpayPaymentAndConfirmBooking({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    bookingId,
    type,
  });

  res.status(200).json({
    success: true,
    message: "Payment verified and booking confirmed",
    booking: updatedBooking,
  });
});



export const getBookingHistoryController = asyncHandler(async (req, res) => {
  const clerkUserId = req.auth.userId;
  const userId = await User.findOne({ clerkUserId });

  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authenticated" });
  }

  try {
    const bookingHistory = await getBookingHistory(userId._id);

    res.status(200).json({
      success: true,
      message: "Booking history fetched successfully",
      data: bookingHistory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
