import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
    name: "favorite",
    initialState: {
        favorites : [],
    },
    reducers: {
        updateFavorite: (state, action) => {
            state.favorites = action.payload;
        },
    }
})

export const { updateFavorite } = favoriteSlice.actions;

export default favoriteSlice.reducer;