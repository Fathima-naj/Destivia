import { createRazorpayOrderAndSave } from "../service/paymentService.js";

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

import asyncHandler from "../utilis/asyncHandler.js";
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


