import axios from "axios";

const api = axios.create({
    // baseURL: "http://127.0.0.1:8000/api",
    baseURL: "https://doquest.infinityfreeapp.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor → Attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// (Optional) Response Interceptor → Handle 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid → logout user
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/sign-in";
        }
        return Promise.reject(error);
    }
);

export default api;
