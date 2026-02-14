import { configureStore } from '@reduxjs/toolkit';

import authSlice from "../features/auth/authSlice"
import cartSlice from "../features/cart/cartSlice"
import productSlice from "../features/product/productSlice"
import orderSlice from "../features/order/orderSlice"
import categorySlice from "../features/category/categorySlice";
import adminSlice from "../features/admin/adminSlice";



export const store = configureStore({
    reducer: {
        auth: authSlice,
        cart: cartSlice,
        products: productSlice,
        orders: orderSlice,
        category: categorySlice,
        admin: adminSlice,
    }
});

export default store;