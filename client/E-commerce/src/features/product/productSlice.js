import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllProducts, fetchProductById, searchProducts } from "../product/productAPI";

// Async thunks
export const getAllProducts = createAsyncThunk("products/getAll", async (_, thunkAPI) => {
    try {
        return await fetchAllProducts();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed to fetch products" });
    }
}
);

export const getProductDetails = createAsyncThunk("products/getDetails", async (productId, thunkAPI) => {
    try {
        return await fetchProductById(productId);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed to fetch product details" });
    }
}
);

export const searchProductByKeyword = createAsyncThunk("products/search", async (keyword, thunkAPI) => {
    try {
        return await searchProducts(keyword);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data || { message: "Search failed" });
    }
}
);

// Initial state
const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
};

// Slice
const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        clearProductDetails: (state) => {
            state.product = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all products
            .addCase(getAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // Get single product details
            .addCase(getProductDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload.product;
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // Search products
            .addCase(searchProductByKeyword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProductByKeyword.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
            })
            .addCase(searchProductByKeyword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export const { clearProductDetails, clearError } = productSlice.actions;
export default productSlice.reducer;
