import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser, fetchUserProfile, verifyOTPAPI } from "./authAPI";

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
      // backend now returns: { message, email }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// ===== VERIFY OTP =====
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      return await verifyOTPAPI(otpData);
      // backend returns: { _id, name, email, role, token }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
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
    registeredEmail: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = false;
      state.registeredEmail = null;
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
        state.success = true;
        state.registeredEmail = action.payload.email;
        // Don't set isAuthenticated — user must verify OTP first
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ===== VERIFY OTP =====
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
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
        state.registeredEmail = null;

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
      .addCase(verifyOtp.rejected, (state, action) => {
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
