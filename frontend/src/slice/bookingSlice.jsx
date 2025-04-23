
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
      console.log('booking resp.',response.data)
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
    error: null,
  },
  reducers: {
    clearBookingState: (state) => {
      state.loading = false;
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createBookingOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
