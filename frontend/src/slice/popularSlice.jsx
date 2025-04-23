import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";


export const fetchPopularFlights = createAsyncThunk(
    'flights/fetchPopular',
    async () => {
      const response = await axiosInstance.get('/popular/popularFlight');
      return response.data;
    }
  );
  

  const popularSlice=createSlice({
    name:"popular",
    initialState:{
        flight:[],
      loading:false,
      error:null,
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchPopularFlights.fulfilled,(state,action)=>{
            state.loading=false,
            state.flight=action.payload
        })
    }
  })

  export default popularSlice.reducer