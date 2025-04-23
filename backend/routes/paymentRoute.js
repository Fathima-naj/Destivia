import express from 'express';
import { confirmBookingPayment, createBookingOrder } from '../controller/paymentController.js';
import clerkAuth from '../middleware/authMiddleware.js';

const paymentroute = express.Router();


paymentroute.post('/create-order',clerkAuth, createBookingOrder);
paymentroute.post('/verify',clerkAuth,confirmBookingPayment)
export default paymentroute;
