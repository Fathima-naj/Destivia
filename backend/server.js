import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv';
//import userRoutes from './routes/userRoute.js';
//import webhookRouter from './routes/webhookRoute.js';
import cors from 'cors'
import hotelRouter from './routes/hotelRoute.js';
import errorHandler from './middleware/errorHandler.js';
import flightRouter from './routes/flightRoutes.js';
import http from 'http'                     // <-- Add this
import { Server } from 'socket.io' 
import clerkWebhookRoutes from './routes/clerkWebhook.js';

import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import placeRoute from './routes/placeRoute.js';
import paymentroute from './routes/paymentRoute.js';
import popRoute from './routes/popularRoute.js';
import bookRouter from './routes/bookingRoute.js';
import chatSocket from './socket/chatSocket.js';
dotenv.config()
const app = express()

app.use(ClerkExpressWithAuth());
app.use(express.json())

const server = http.createServer(app)              
const io = new Server(server, {
  transports: ['websocket'],
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true
  }
})

connectDB();

 

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));


chatSocket(io)

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
