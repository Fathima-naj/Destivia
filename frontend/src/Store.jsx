import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authSlice'
import hotelReducer from './slice/hotelSlice'
import flightReducer from './slice/flightSlice'
import placeReducer from "./slice/placeSlice"
import bookReducer from "./slice/bookingSlice"
import popularReducer from "./slice/popularSlice"
import bookingsReducer from "./slice/getbookSlice"
import uiReducer from './slice/uiSlice';
const store=configureStore({
    reducer:{
        auth:authReducer,
        hotels:hotelReducer,
        flights:flightReducer,
        place:placeReducer,
        booking:bookReducer,
        popular:popularReducer,
        bookings:bookingsReducer,
        ui:uiReducer
    }
})

export default store