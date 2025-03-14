import axios from "axios";

// Use the environment variable for the API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Function to setup interceptors (accepts store as an argument)
export const setupInterceptors = (store) => {
  // Add a request interceptor
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("token");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if the error is due to an expired token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Mark the request as retried

        try {
          // Dispatch the refreshToken action by its type
          const { accessToken } = await store.dispatch({ type: "auth/refreshToken" }).unwrap();

          // Update the Authorization header with the new accessToken
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If token refresh fails, dispatch the logout action by its type
          store.dispatch({ type: "auth/logout" });
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;