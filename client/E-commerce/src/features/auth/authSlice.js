import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, fetchUserProfile } from "./authAPI";

// ===== Helpers =====
const storedUser = JSON.parse(localStorage.getItem("user"));

// ===== LOGIN =====
export const login = createAsyncThunk(
  "auth/login",
  async (loginData, { rejectWithValue }) => {
    try {
      return await loginUser(loginData); 
      // backend returns: { _id, name, email, role, token }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ===== REGISTER =====
export const register = createAsyncThunk(
  "auth/register",
  async (registerData, { rejectWithValue }) => {
    try {
      return await registerUser(registerData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ===== GET PROFILE =====
export const getProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserProfile(); // returns user object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load profile"
      );
    }
  }
);

// ===== SLICE =====
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser?.user || null,
    token: storedUser?.token || null,
    isAuthenticated: !!storedUser?.token,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = false;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // ===== LOGIN =====
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ FIX: build user object manually
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };

        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;

        // ✅ Store SAME structure in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            token: action.payload.token,
            user: {
              _id: action.payload._id,
              name: action.payload.name,
              email: action.payload.email,
              role: action.payload.role,
            },
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== REGISTER =====
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
        };

        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;

        localStorage.setItem(
          "user",
          JSON.stringify({
            token: action.payload.token,
            user: {
              _id: action.payload._id,
              name: action.payload.name,
              email: action.payload.email,
              role: action.payload.role,
            },
          })
        );
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== PROFILE =====
    builder
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
