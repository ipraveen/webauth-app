import axios from 'axios';

export { type AxiosResponse } from 'axios';

// axios.defaults.withCredentials = true

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

export const axiosPrivate = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// To avoid multiple refresh requests
// let isRefreshing = false;
// let failedQueue = [];
// Request interceptor → attach token
api.interceptors.request.use(
    (config) => {
        const authSer = localStorage.getItem('AUTH_STATE');
        if (authSer) {
            const { token } = JSON.parse(authSer);
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// // Helper to process the queue after refresh
// const processQueue = (error, token = null) => {
//     failedQueue.forEach((prom) => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });
//     failedQueue = [];
// };

// // Response interceptor → handle 401 errors
// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;

//         // Prevent infinite loops
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             if (isRefreshing) {
//                 // Wait for token refresh to complete
//                 return new Promise((resolve, reject) => {
//                     failedQueue.push({ resolve, reject });
//                 })
//                     .then((token) => {
//                         originalRequest.headers['Authorization'] = `Bearer ${token}`;
//                         return api(originalRequest);
//                     })
//                     .catch((err) => Promise.reject(err));
//             }

//             originalRequest._retry = true;
//             isRefreshing = true;

//             try {
//                 const refreshToken = localStorage.getItem('refreshToken');
//                 const { data } = await axios.post('https://your-api.com/auth/refresh', {
//                     refreshToken,
//                 });

//                 // Save new tokens
//                 localStorage.setItem('accessToken', data.accessToken);
//                 localStorage.setItem('refreshToken', data.refreshToken);

//                 api.defaults.headers['Authorization'] = `Bearer ${data.accessToken}`;
//                 processQueue(null, data.accessToken);

//                 return api(originalRequest);
//             } catch (err) {
//                 processQueue(err, null);
//                 // (Optional) logout if refresh fails
//                 localStorage.removeItem('accessToken');
//                 localStorage.removeItem('refreshToken');
//                 window.location.href = '/login';
//                 return Promise.reject(err);
//             } finally {
//                 isRefreshing = false;
//             }
//         }

//         return Promise.reject(error);
//     }
// );

export default api;
