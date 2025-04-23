import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv';
//import userRoutes from './routes/userRoute.js';
//import webhookRouter from './routes/webhookRoute.js';
import cors from 'cors'
import hotelRouter from './routes/hotelRoute.js';
import errorHandler from './middleware/errorHandler.js';
import flightRouter from './routes/flightRoutes.js';

import clerkWebhookRoutes from './routes/clerkWebhook.js';

import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import placeRoute from './routes/placeRoute.js';
import paymentroute from './routes/paymentRoute.js';
import popRoute from './routes/popularRoute.js';
import bookRouter from './routes/bookingRoute.js';
dotenv.config()
const app = express()

app.use(ClerkExpressWithAuth());
app.use(express.json())


connectDB();

 

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));



app.use('/api/hotels', hotelRouter)
app.use('/api/flight',flightRouter)
app.use("/api/popular",popRoute)
app.use("/api/places",placeRoute)
app.use('/api/clerk', clerkWebhookRoutes);
app.use('/api/payment',paymentroute)
app.use('/api/book',bookRouter)
const PORT = process.env.PORT || 5001  


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`)
})
