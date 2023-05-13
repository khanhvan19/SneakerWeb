import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPublic from "utils/axiosPublic";


const shipperSlice = createSlice({
    name: "shipper",
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
            .addCase(handleShipperLogin.pending, (state, action) => {
                state.login.status = 'loading'
            })
            .addCase(handleShipperLogin.fulfilled, (state, action) => {
                state.login.status = 'success'
                state.login.data = action.payload
                state.login.error = null
                state.msg = null
            })
            .addCase(handleShipperLogin.rejected, (state, action) => {
                state.login.status = 'fail'
                state.login.error = action.payload
            })
            .addCase(handleShipperLogout.pending, (state, action) => {
                state.login.status = 'loading'
            })
            .addCase(handleShipperLogout.fulfilled, (state, action) => {
                state.login.status = 'success'
                state.login.data = null
                state.login.error = null
                state.msg = action.payload
            })
            .addCase(handleShipperLogout.rejected, (state, action) => {
                state.login.status = 'fail'
                state.login.error = action.payload.message
            })
    }
});

export const handleShipperLogin = createAsyncThunk(
    "auth/handleShipperLogin", async (data, {rejectWithValue}) => {
        try {
            const res = await axiosPublic.post('employee/shipper-login', data);
            return res;
        } catch (err) {
            throw rejectWithValue(err);
        }
    }
)

export const handleShipperLogout = createAsyncThunk(
    "auth/handleShipperLogout", async () => {
        return 'Đăng xuất thành công';
    }
)

// export const {} = shipperSlice.actions

export default shipperSlice.reducer;

