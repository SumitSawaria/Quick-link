import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const axiosInstance = axios.create({
    baseURL,
    timeout: 20000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};

        if (error.code === "ECONNABORTED") {
            return Promise.reject({
                message: "Request timed out. Please try again.",
                status: 408,
            });
        }

        if (!error.response) {
            return Promise.reject({
                message: "Network error. Please check your connection.",
                status: 0,
            });
        }

        const isUnauthorized = error.response.status === 401;
        const isRefreshCall = originalRequest?.url?.includes("/api/auth/refresh");

        if (isUnauthorized && !originalRequest._retry && !isRefreshCall) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber(() => {
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(`${baseURL}/api/auth/refresh`, {}, { withCredentials: true });
                onRefreshed();
                return axiosInstance(originalRequest);
            } catch {
                return Promise.reject({
                    message: "Your session has expired. Please login again.",
                    status: 401,
                });
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject({
            message: error.response?.data?.message || error.message || "Something went wrong",
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default axiosInstance;
