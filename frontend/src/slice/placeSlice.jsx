import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

export const fetchPlaces = createAsyncThunk(
  'place/fetchPlaces',
  async ({ city, query }) => {
    const { data } = await axiosInstance.get(`/places/search`, {
      params: { city, query },
    });
    return data;
  }
);

export const fetchPlaceDetails = createAsyncThunk(
  'place/fetchPlaceDetails',
  async (fsq_id) => {
    const { data } = await axiosInstance.get(`/places/${fsq_id}`);
    return data;
  }
);

const placeSlice = createSlice({
  name: 'place',
  initialState: {
    places: [],
    selectedPlace: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPlaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.places = action.payload;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchPlaceDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlaceDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedPlace = action.payload;
      })
      .addCase(fetchPlaceDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default placeSlice.reducer;
