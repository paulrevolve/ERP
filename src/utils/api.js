// import axios from "axios";

// // 1. Create a custom instance
// const api = api.create();

// // 2. REQUEST Interceptor: Adds the header to EVERY call automatically
// api.interceptors.request.use(
//   (config) => {
//     const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
//     if (user.token) {
//       config.headers.Authorization = `Bearer ${user.token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// // 3. RESPONSE Interceptor: Global 401 Redirect logic
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // If the server returns 401, clear storage and go to /login
//     if (error.response && error.response.status === 401) {
//       localStorage.clear();
//       // This goes to yourdomain.com/login regardless of current sub-route
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   },
// );

// export default api;

import axios from "axios";

const api = axios.create();

let isRedirecting = false; // 🔥 prevent multiple redirects

// REQUEST
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 Case 1: Server responded
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        handleRedirect("Session expired. Please login again.");
      } else if (status === 503) {
        const message =
          error.response.data?.message || "Service is currently unavailable.";

        handleRedirect(message);
      }
    }

    // 🔴 Case 2: Server DOWN / CORS / Network issue
    else if (error.request) {
      handleRedirect("Server is not reachable. Please try again later.");
    }

    return Promise.reject(error);
  },
);

// 🔥 central redirect handler
function handleRedirect(message) {
  if (isRedirecting) return;

  isRedirecting = true;

  alert(message);

  // small delay ensures alert finishes before navigation
  setTimeout(() => {
    localStorage.clear();
    window.location.href = "/login";
  }, 100);
}

export default api;
