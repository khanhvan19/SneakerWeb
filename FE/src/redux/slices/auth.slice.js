import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPublic from "utils/axiosPublic";


const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            data: null,
            status: 'idle',//'idle' | 'loading' | 'success' | 'fail'
            error: null,
        },
        msg: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(handleEmployeeLogin.pending, (state, action) => {
                state.login.status = 'loading'
            })
            .addCase(handleEmployeeLogin.fulfilled, (state, action) => {
                state.login.status = 'success'
                state.login.data = action.payload
                state.login.error = null
                state.msg = null
            })
            .addCase(handleEmployeeLogin.rejected, (state, action) => {
                state.login.status = 'fail'
                state.login.error = action.payload
            })
            .addCase(handleEmployeeLogout.pending, (state, action) => {
                state.login.status = 'loading'
            })
            .addCase(handleEmployeeLogout.fulfilled, (state, action) => {
                state.login.status = 'success'
                state.login.data = null
                state.login.error = null
                state.msg = action.payload
            })
            .addCase(handleEmployeeLogout.rejected, (state, action) => {
                state.login.status = 'fail'
                state.login.error = action.payload.message
            })
            .addCase(handleRefreshToken.fulfilled, (state, action) => {
                state.login.data = {...state.login.data, accessToken: action.payload};
            })
    }
});

export const handleEmployeeLogin = createAsyncThunk(
    "auth/handleEmployeeLogin", async (data, {rejectWithValue}) => {
        try {
            const res = await axiosPublic.post('employee/login', data);
            return res;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const handleEmployeeLogout = createAsyncThunk(
    "auth/handleEmployeeLogout", async (id, {rejectWithValue}) => {
        try {
            const res = await axiosPublic.post('employee/logout', id);
            return res;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const handleRefreshToken = createAsyncThunk(
    "auth/handleRefreshToken", async (data) => {
        const accessToken = await axiosPublic.post('employee/refresh', data);
        return accessToken;
    }
)

// export const {} = authSlice.actions

export default authSlice.reducer;

