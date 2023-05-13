import axios from "axios";
import jwtDecode from "jwt-decode";
import store from "redux/store";
import { handleRefreshToken } from "redux/slices/employeeAuth.slice";

const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
})

axiosPrivate.interceptors.request.use(
    async (config) => {
        const user = store.getState().auth.login.data;
        let date = new Date();
        const tokenDecoded = jwtDecode(user?.accessToken);
        if(tokenDecoded.exp * 1000 < date.getTime()) {
            await store.dispatch(handleRefreshToken(user))
            config.headers["token"] = store.getState().auth.login.data.accessToken;
        }
        return config
    },
    function(error) {
        return Promise.reject(error);
    }
)

axiosPrivate.interceptors.response.use(
    function (response) {
        return response.data
    },
    function(error) {
        return Promise.reject(error.response.data);
    }
)

export default axiosPrivate;