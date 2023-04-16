import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        userMode: 'light',
        adminMode: 'light'
    },
    reducers: {
        toggleAdminMode: (state, action) => {
            state.adminMode = (state.adminMode === 'light') ? 'dark' : 'light';
        },
        toggleUserMode: (state, action) => {
            state.userMode = (state.userMode === 'light') ? 'dark' : 'light';
        }
    }
})

export const {toggleAdminMode, toggleUserMode} = themeSlice.actions;

export default themeSlice.reducer;