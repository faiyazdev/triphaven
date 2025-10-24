import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: ensure originalRequest exists
    if (!originalRequest) return Promise.reject(error);

    // Handle 401 and prevent infinite retry loop
    if (
      error.response?.status === 401 ||
      (error.response?.message === "Unauthorized" && !originalRequest._retry)
    ) {
      originalRequest._retry = true;

      try {
        // ⚠️ Use base axios (not api) to avoid recursion
        const res = await api.post("auth/refresh-access-token");

        const newAccessToken = res.data.accessToken;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // ✅ Retry the original request with the new token
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("authData");

        // Redirect safely
        window.location.replace("/signin");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
