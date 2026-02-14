import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./categoryAPI";

// Fetch all categories
export const getAllCategories = createAsyncThunk(
  "category/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAllCategories();
      return data.categories;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create category
export const addCategory = createAsyncThunk(
  "category/addCategory",
  async (name, { rejectWithValue }) => {
    try {
      const data = await createCategory(name);
      return data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update category
export const editCategory = createAsyncThunk(
  "category/editCategory",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const data = await updateCategory(id, name);
      return data.updatedCategory;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete category
export const removeCategory = createAsyncThunk(
  "category/removeCategory",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategory(id);
      return id; // return deleted ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit Category
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;

        if (!action.payload) return; // 🛡️ prevent crash

        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Category
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (cat) => cat._id !== action.payload
        );
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
