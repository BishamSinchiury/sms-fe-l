import axios from "axios";

const axiosBase = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
})

export default axiosBase;