
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance"


export const createBookingOrder = createAsyncThunk(
  "booking/createBookingOrder",
  async ({ type, bookingData, token }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        "/payment/create-order",
        { type, bookingData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Add new thunk for getting booking history
export const getBookingHistory = createAsyncThunk(
  "booking/getBookingHistory",
  async (token, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/payment/booking-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    loading: false,
    order: null,
    bookingHistory: [],
    error: null,
    success: false,
  },
  reducers: {
    clearBookingState: (state) => {
      state.loading = false;
      state.order = null;
      state.error = null;
      state.success = false;
    },
    setBookingSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create booking order cases
      .addCase(createBookingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.success = true;
      })
      .addCase(createBookingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Booking history cases
      .addCase(getBookingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookingHistory.fulfilled, (state, action) => {
        state.loading = false;
        console.log('bookinghistory',action.payload)
        state.bookingHistory = action.payload;
      })
      .addCase(getBookingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingState, setBookingSuccess } = bookingSlice.actions;
export default bookingSlice.reducer;
