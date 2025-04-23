import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


export const fetchFlights = createAsyncThunk(
    "flights/fetchFlights",
    async ({ from, to, date ,passengers,classType}, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get("/flight/search", {
          params: { from, to, date ,passengers,classType },
        });

        console.log("API Response:", response.data);

        if (!(response.data)) {
          throw new Error("Invalid API response format");
        }

        return response.data; 
      } catch (error) {
        console.error(" API Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to fetch flights");
      }
    }
);



const flightSlice = createSlice({
  name: "flights",
  initialState: {
    flights: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload;
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default flightSlice.reducer;
