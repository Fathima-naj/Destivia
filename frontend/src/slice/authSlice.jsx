import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance.jsx";
const initialState={
    isAuthenticated:false,
    loading:false,
    error:null,
    user:null,
    role:null
}

export const fetchUserDetails=createAsyncThunk(
    'user/fetchUserDetails',
    async(__,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.get(`/users/me`);
            console.log(response.data.user);
            return response.data.user;
          } catch (error) {
            if (error.response?.status === 401) {
              return rejectWithValue("Please login with your credentials");
            }
            return rejectWithValue(
              error.response?.data?.message || "Error in logined person"
            );
          }
    }
)

const authSlice=createSlice({
  name:'auth',
  initialState,
  reducers:{
    //setUser:(state,action)=>state.user=action.payload,
    setUser: (state, action) => ({ ...state, user: action.payload }),
    resetAuthSlice:()=>initialState
  },
  extraReducers:(builder)=>{
    builder
    .addCase(fetchUserDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      console.log(state.user,'usersss')
      state.error = null;
      state.role=action.payload.role
        state.isAuthenticated = Boolean(action.payload.role);
      
    })
    .addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.user = null;
      state.isAuthenticated = false;
      state.role=null;
    })
},
});

export const { resetAuthState,setUser } = authSlice.actions;

export default authSlice.reducer;
