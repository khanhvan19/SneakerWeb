import axios from "axios";

const axiosPublic = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_BASE_URL,
})

axiosPublic.interceptors.request.use(
    async (config) => {
        return config
    },
    function(error) {
        return Promise.reject(error);
    }
)

axiosPublic.interceptors.response.use(
    function (response) {
        return response.data
    },
    function(error) {
        return Promise.reject(error.response.data);
    }
)

export default axiosPublic

