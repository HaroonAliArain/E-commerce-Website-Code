// features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDashboardStats } from "../../features/admin/adminAPI";

// Thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getDashboardStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    users: [],
    products: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.users = action.payload.users;
        state.products = action.payload.products;
        state.orders = action.payload.orders;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export default adminSlice.reducer;
