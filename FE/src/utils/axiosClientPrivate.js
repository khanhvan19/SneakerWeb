import axios from "axios";
import jwtDecode from "jwt-decode";
import store from "redux/store";
import { handleRefreshToken } from "redux/slices/clientAuth.slice";

const axiosClientPrivate = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
})

axiosClientPrivate.interceptors.request.use(
    async (config) => {
        const client = store.getState().client.login.data;
        let date = new Date();
        const tokenDecoded = jwtDecode(client?.accessToken);
        if(tokenDecoded.exp * 1000 < date.getTime()) {
            await store.dispatch(handleRefreshToken(client))
            config.headers["token"] = store.getState().client.login.data.accessToken;
        }
        return config
    },
    function(error) {
        return Promise.reject(error);
    }
)

axiosClientPrivate.interceptors.response.use(
    function (response) {
        return response.data
    },
    function(error) {
        return Promise.reject(error.response.data);
    }
)

export default axiosClientPrivate;