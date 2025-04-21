import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

//  Code reused from: [Django & React Web App Tutorial - Authentication, Databases, Deployment & More], [Tech with Team], [https://www.youtube.com/watch?v=c-QsfbznSXI]
// The codes that was reused was from Line 1 to Line 26

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;