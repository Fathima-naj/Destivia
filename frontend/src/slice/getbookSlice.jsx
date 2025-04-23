import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { useDispatch } from "react-redux";

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/book/user-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('response booking', res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch bookings");
    }
  }
);

export const deleteBooking = createAsyncThunk(
  "bookings/deleteBooking",
  async ({ type, bookingId, token }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/book/delete-booking/${type}/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Return the data for successful deletion
      return { type, bookingId }; // this allows us to update the state accordingly
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to delete booking");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    hotel: [],
    place: [],
    flight: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.hotel = action.payload.hotel;
        state.place = action.payload.place;
        state.flight = action.payload.flight;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        const { type, bookingId } = action.payload;

        if (type === "hotel") {
          state.hotel = state.hotel.filter((item) => item._id !== bookingId);
        } else if (type === "place") {
          state.place = state.place.filter((item) => item._id !== bookingId);
        } else if (type === "flight") {
          state.flight = state.flight.filter((item) => item._id !== bookingId);
        }
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default bookingsSlice.reducer;
