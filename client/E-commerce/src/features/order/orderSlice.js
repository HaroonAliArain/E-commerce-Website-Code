import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOrderAPI,
  fetchMyOrdersAPI,
  fetchAllOrdersAPI,
  updateOrderStatusAPI,
  fetchOrderByIdAPI,
  deleteOrderAPI
} from "./orderAPI";

// =======================
// Async Thunks
// =======================

// Create Order
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, thunkAPI) => {
    try {
      const res = await createOrderAPI(orderData);
      return res; // backend returns { success, order }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to create order" }
      );
    }
  }
);

// Fetch My Orders
export const fetchMyOrders = createAsyncThunk(
  "orders/myOrders",
  async (_, thunkAPI) => {
    try {
      const res = await fetchMyOrdersAPI();
      return res; // backend returns { success, orders }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch orders" }
      );
    }
  }
);

// Fetch All Orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/allOrders",
  async (_, thunkAPI) => {
    try {
      const res = await fetchAllOrdersAPI();
      return res; // backend returns { success, allOrders }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch all orders" }
      );
    }
  }
);

// Update Order Status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, statusData }, thunkAPI) => {
    try {
      const res = await updateOrderStatusAPI(orderId, statusData);
      return res; // backend returns updated order
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to update status" }
      );
    }
  }
);

// Fetch Single Order
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (orderId, thunkAPI) => {
    try {
      const res = await fetchOrderByIdAPI(orderId);
      return res; // backend returns { success, order }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch order" }
      );
    }
  }
);

// Delete Order (Admin)
export const deleteOrder = createAsyncThunk(
  "orders/delete",
  async (orderId, thunkAPI) => {
    try {
      const res = await deleteOrderAPI(orderId);
      return res; // backend returns { success, message, deletedOrderId }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to delete order" }
      );
    }
  }
);

// =======================
// Initial State
// =======================
const initialState = {
  orders: [],      // All orders (admin)
  myOrders: [],    // Orders of logged-in user
  order: null,     // Single order details
  loading: false,
  error: null,
  success: false,
};

// =======================
// Slice
// =======================
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.order = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ----------------------
      // Create Order
      // ----------------------
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload.order; // <- extract order from response
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ----------------------
      // Fetch My Orders
      // ----------------------
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload.orders || []; // <- extract orders array
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ----------------------
      // Fetch All Orders (Admin)
      // ----------------------
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || []; // <- extract allOrders array
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ----------------------
      // Update Order Status (Admin)
      // ----------------------
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedOrder = action.payload;
        // Update in both arrays if present
        state.orders = state.orders.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o
        );
        state.myOrders = state.myOrders.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ----------------------
      // Fetch Single Order
      // ----------------------
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order; // <- extract order from response
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ----------------------
      // Delete Order (Admin)
      // ----------------------
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        // Remove deleted order from orders array
        state.orders = state.orders.filter(
          (o) => o._id !== action.payload.deletedOrderId
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export const { clearOrderDetails, clearError, clearSuccess } = orderSlice.actions;
export default orderSlice.reducer;
