import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage if exists
const cartItemsFromStorage = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const initialState = {
    cartItems: cartItemsFromStorage,
    totalQuantity: cartItemsFromStorage.reduce(
        (acc, item) => acc + item.quantity,
        0
    ),
    totalPrice: cartItemsFromStorage.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    ),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload; // { _id, name, price, quantity, image }
            const existItem = state.cartItems.find(i => i._id === item._id);

            const newQuantity = Number(item.quantity) || 1; // <-- force number

            if (existItem) {
                existItem.quantity += newQuantity;
            } else {
                state.cartItems.push({ ...item, quantity: newQuantity });
            }

            state.totalQuantity = state.cartItems.reduce(
                (acc, i) => acc + Number(i.quantity),
                0
            );
            state.totalPrice = state.cartItems.reduce(
                (acc, i) => acc + Number(i.quantity) * Number(i.price),
                0
            );

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },


        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (i) => i._id !== action.payload
            );

            state.totalQuantity = state.cartItems.reduce(
                (acc, i) => acc + i.quantity,
                0
            );
            state.totalPrice = state.cartItems.reduce(
                (acc, i) => acc + i.quantity * i.price,
                0
            );

            localStorage.setItem(
                "cartItems",
                JSON.stringify(state.cartItems)
            );
        },

        increaseQty: (state, action) => {
            const item = state.cartItems.find(i => i._id === action.payload);
            if (item) item.quantity = Number(item.quantity) + 1;

            state.totalQuantity = state.cartItems.reduce(
                (acc, i) => acc + Number(i.quantity),
                0
            );
            state.totalPrice = state.cartItems.reduce(
                (acc, i) => acc + Number(i.quantity) * Number(i.price),
                0
            );

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },
        decreaseQty: (state, action) => {
            const item = state.cartItems.find(i => i._id === action.payload);
            if (item && Number(item.quantity) > 1) {
                item.quantity = Number(item.quantity) - 1;
            }

            state.totalQuantity = state.cartItems.reduce(
                (acc, i) => acc + Number(i.quantity),
                0
            );
            state.totalPrice = state.cartItems.reduce(
                (acc, i) => acc + Number(i.quantity) * Number(i.price),
                0
            );

            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            localStorage.removeItem("cartItems");
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
