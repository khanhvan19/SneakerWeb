import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClientPrivate from "utils/axiosClientPrivate";
import axiosPublic from "utils/axiosPublic";

const clientAuthSlice = createSlice({
    name: "client",
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
            .addCase(handleCustomerLogin.pending, (state, action) => {
                state.login.status = 'loading'
            })
            .addCase(handleCustomerLogin.fulfilled, (state, action) => {
                state.login.status = 'success'
                state.login.data = action.payload
                state.login.error = null
                state.msg = null
            })
            .addCase(handleCustomerLogin.rejected, (state, action) => {
                state.login.status = 'fail'
                state.login.error = action.payload
            })
            .addCase(handleCustomerLogout.pending, (state, action) => {
                state.login.status = 'loading'
            })
            .addCase(handleCustomerLogout.fulfilled, (state, action) => {
                state.login.status = 'success'
                state.login.data = null
                state.login.error = null
                state.msg = action.payload
            })
            .addCase(handleCustomerLogout.rejected, (state, action) => {
                state.login.status = 'fail'
                state.login.error = action.payload.message
            })
            .addCase(handleCustomerChangeInfo.fulfilled, (state, action) => {
                state.login.data = { ...state.login.data , ...action.payload } 
            })
            .addCase(handleRefreshToken.fulfilled, (state, action) => {
                state.login.data = {...state.login.data, accessToken: action.payload};
            })
    }
});

export const handleCustomerLogin = createAsyncThunk(
    "client/handleCustomerLogin", async (data, {rejectWithValue}) => {
        try {
            const res = await axiosPublic.post('customer/login', data);
            return res;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const handleCustomerLogout = createAsyncThunk(
    "client/handleCustomerLogout", async (id, {rejectWithValue}) => {
        try {
            const res = await axiosPublic.post('customer/logout', id);
            return res;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const handleCustomerChangeInfo = createAsyncThunk(
    "client/handleCustomerChangeInfo", async (data, {rejectWithValue}) => {
        try {
            console.log(data);
            const res = await axiosPublic
                .put(`customer/${data.id}`, data.formData,
                    { headers: { "Content-Type": "multipart/form-data" }}
                )
            return res.result;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const handleRefreshToken = createAsyncThunk(
    "client/handleRefreshToken", async (data) => {
        const accessToken = await axiosPublic.post('customer/refresh', data);
        return accessToken;
    }
)

// export const {} = authSlice.actions

export default clientAuthSlice.reducer;

