import express from 'express';
import { confirmBookingPayment, createBookingOrder, getBookingHistoryController } from '../controller/paymentController.js';
import clerkAuth from '../middleware/authMiddleware.js';

const paymentroute = express.Router();


paymentroute.post('/create-order',clerkAuth, createBookingOrder);
paymentroute.post('/verify',clerkAuth,confirmBookingPayment)
paymentroute.get('/booking-history',getBookingHistoryController)
export default paymentroute;
