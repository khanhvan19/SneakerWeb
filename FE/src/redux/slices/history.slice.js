import { createSlice } from "@reduxjs/toolkit";

const historySlice = createSlice({
    name: "history",
    initialState: {
        prevRoute : null,
    },
    reducers: {
        addHistoryRoute: (state, action) => {
            state.prevRoute = action.payload;
        },
    }
})

export const {addHistoryRoute} = historySlice.actions;

export default historySlice.reducer;