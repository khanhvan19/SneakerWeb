import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        totalCart : 0,
    },
    reducers: {
        updateTotalCart: (state, action) => {
            state.totalCart = action.payload;
        },
    }
})

export const {updateTotalCart} = cartSlice.actions;

export default cartSlice.reducer;