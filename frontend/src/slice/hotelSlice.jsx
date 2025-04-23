
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async ({ location, adults = 1, limit = 10,checkIn, checkOut }, thunkAPI) => {
    try {
      console.log("Frontend request params:", {
        location,
        adults,
        checkIn,
         checkOut,
        limit
      });
      
      const response = await axiosInstance(`/hotels/search`,
        {
          params: { location, checkIn, checkOut, adults, limit },
        }
      );
      console.log('hotel data',response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data || error.message);
    }
  }
);


export const fetchHotelById = createAsyncThunk(
  "hotels/fetchHotelById",
  async (hotelId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/hotels/${hotelId}`);
      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


const hotelSlice = createSlice({
  name: "hotels",
  initialState: {
    hotels: [],
    selectedHotel:null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload;
        console.log("hotel action" , action.payload)
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  
      .addCase(fetchHotelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
  });

export default hotelSlice.reducer;
