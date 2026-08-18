import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

const ERROR_MESSAGES = {
    400: "The request could not be understood. Please check your input and try again.",
    401: "You are not authorized. Please log in and try again.",
    403: "You don't have permission to do that.",
    404: "The requested resource could not be found.",
    409: "This action conflicts with existing data.",
    422: "Some of the submitted data is invalid.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Something went wrong on our end. Please try again shortly.",
    503: "The service is temporarily unavailable. Please try again shortly.",
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("ecobazar_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        let friendlyMessage = "Something went wrong. Please try again.";

        if (error.code === "ECONNABORTED") {
            friendlyMessage =
                "The request timed out. Please check your connection and try again.";
        } else if (!error.response) {
            friendlyMessage =
                "Network error. Please check your internet connection.";
        } else {
            friendlyMessage =
                ERROR_MESSAGES[error.response.status] || friendlyMessage;
        }

        return Promise.reject({
            ...error,
            friendlyMessage,
        });
    }
);

export default axiosInstance;